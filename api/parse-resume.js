import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { getLlmProvider } from "./llm/provider.js";
import { calculateExperience, expandCompactExtraction, fieldValue, normalizeExtractionShape, COMPACT_RESUME_SCHEMA, VISION_RESUME_SCHEMA } from "./resumeExtractionSchema.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA256_PATTERN = /^[0-9a-f]{64}$/i;
const CORE_FIELDS = ["first_name", "last_name", "email", "phone", "location", "current_title", "current_company", "years_experience", "skills"];

function send(response, status, payload) {
  return response.status(status).json(payload);
}

function compactField(value, normalizedValue = value) {
  return { value, normalizedValue, source: "CONTEXTUAL", confidence: 0.45, validationStatus: "REQUIRES_REVIEW", evidence: [] };
}

function normalizeAndValidate(extracted, fallbackFields = {}) {
  const personal = extracted.personalInformation;
  const professional = extracted.professionalInformation;
  const fill = (target, value) => { if (!fieldValue(target) && value) Object.assign(target, compactField(value)); };
  if (fieldValue(personal.fullName)) {
    const parts = String(fieldValue(personal.fullName)).trim().split(/\s+/);
    fill(personal.firstName, parts[0]);
    fill(personal.lastName, parts.length > 1 ? parts.slice(1).join(" ") : "");
  }
  fill(personal.firstName, fallbackFields.first_name);
  fill(personal.lastName, fallbackFields.last_name);
  if (!personal.emails.some((item) => fieldValue(item)) && fallbackFields.email) personal.emails.push(compactField(fallbackFields.email, fallbackFields.email.toLowerCase()));
  if (!personal.phones.some((item) => fieldValue(item)) && fallbackFields.phone) personal.phones.push(compactField(fallbackFields.phone));
  fill(personal.city, fallbackFields.location);
  fill(professional.currentDesignation, fallbackFields.current_title);
  fill(professional.currentCompany, fallbackFields.current_company);
  if (!fieldValue(professional.selfReportedExperienceYears) && fallbackFields.years_experience !== "" && fallbackFields.years_experience != null && Number.isFinite(Number(fallbackFields.years_experience))) {
    Object.assign(professional.selfReportedExperienceYears, compactField(Number(fallbackFields.years_experience), String(fallbackFields.years_experience)));
  }
  if (!extracted.skills.length && Array.isArray(fallbackFields.skills)) {
    extracted.skills = fallbackFields.skills.filter((skill) => typeof skill === "string" && skill.trim()).map((name) => ({
      name: compactField(name.trim()), category: compactField(""), proficiency: compactField(""), sourceSection: compactField("Skills section"),
    }));
  }
  for (const [key, normalizer] of Object.entries({ fullName: (v) => v?.trim().replace(/\s+/g, " "), firstName: (v) => v?.trim().replace(/\s+/g, " "), middleName: (v) => v?.trim().replace(/\s+/g, " "), lastName: (v) => v?.trim().replace(/\s+/g, " ") })) {
    const item = personal[key];
    if (item?.value) item.normalizedValue = normalizer(item.value) || null;
  }
  for (const email of personal.emails) {
    if (email.value) {
      email.normalizedValue = String(email.value).trim().toLowerCase();
      email.validationStatus = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.normalizedValue) ? "VALID" : "INVALID";
    }
  }
  for (const phone of personal.phones) {
    if (phone.value) {
      phone.normalizedValue = String(phone.value).trim().replace(/\s+/g, " ");
      if (phone.normalizedValue.replace(/\D/g, "").length < 7) phone.validationStatus = "INVALID";
    }
  }

  const skillAliases = { "js": "JavaScript", "javascript": "JavaScript", "ts": "TypeScript", "nodejs": "Node.js", "node.js": "Node.js", "reactjs": "React", "postgres": "PostgreSQL", "postgresql": "PostgreSQL" };
  const seenSkills = new Set();
  extracted.skills = extracted.skills.filter((item) => {
    const raw = String(item.name.value || "").trim();
    if (!raw) return false;
    const normalized = skillAliases[raw.toLowerCase().replace(/[\s_-]+/g, "")] || skillAliases[raw.toLowerCase()] || raw.replace(/\s+/g, " ");
    item.name.normalizedValue = normalized;
    const key = normalized.toLowerCase();
    if (seenSkills.has(key)) return false;
    seenSkills.add(key);
    return true;
  });

  const calculated = calculateExperience(extracted.experience);
  const calcField = compactField(calculated.years, calculated.years == null ? null : String(calculated.years));
  calcField.validationStatus = calculated.years == null ? "REQUIRES_REVIEW" : "VALID";
  professional.calculatedExperienceYears = calcField;
  const reported = fieldValue(professional.selfReportedExperienceYears);
  if (reported != null && calculated.years != null && Math.abs(Number(reported) - calculated.years) > 0.5) {
    extracted.discrepancies.push({
      field: compactField("experience"),
      values: [compactField(`Self-reported: ${reported} years`), compactField(`Calculated from non-overlapping dated roles: ${calculated.years} years`)],
      explanation: compactField("The resume's stated experience differs from the duration calculated from dated employment records."),
      severity: compactField("MEDIUM"), evidence: [],
    });
  }
  for (const warning of calculated.warnings) extracted.validationSummary.warnings.push(compactField(warning));
  const invalidEmails = personal.emails.some((email) => email.validationStatus === "INVALID");
  if (invalidEmails) extracted.validationSummary.warnings.push(compactField("One or more email addresses failed format validation."));
  extracted.validationSummary.requiresReview = true;
  extracted.overallStatus = "REVIEW_REQUIRED";
  return extracted;
}

function uiFields(extracted) {
  const p = extracted.personalInformation;
  const work = extracted.professionalInformation;
  const primaryEmail = p.emails.find((item) => item.validationStatus === "VALID") || p.emails[0];
  const primaryPhone = p.phones[0];
  const fieldMap = {
    first_name: p.firstName, last_name: p.lastName, email: primaryEmail, phone: primaryPhone,
    location: p.city?.value ? p.city : p.address,
    current_title: work.currentDesignation?.value ? work.currentDesignation : extracted.experience.find((job) => job.currentlyWorking.value === true)?.title || extracted.experience[0]?.title,
    current_company: work.currentCompany?.value ? work.currentCompany : extracted.experience.find((job) => job.currentlyWorking.value === true)?.company || extracted.experience[0]?.company,
    years_experience: work.calculatedExperienceYears.value ?? work.selfReportedExperienceYears.value ?? "",
    skills: extracted.skills.map((item) => fieldValue(item.name)).filter(Boolean),
    professional_summary: fieldValue(work.summary) || "",
  };
  const confidence = Object.fromEntries(CORE_FIELDS.map((key) => {
    const values = key === "skills" ? extracted.skills.map((item) => item.name.confidence) : [fieldMap[key]?.confidence ?? 0];
    return [key, values.length ? Math.max(0, Math.min(...values)) : 0];
  }));
  const evidence = Object.fromEntries(CORE_FIELDS.map((key) => [key, key === "skills" ? extracted.skills[0]?.name.evidence?.[0]?.originalText || "" : fieldMap[key]?.evidence?.[0]?.originalText || ""]));
  const describe = (label, item) => {
    const value = Array.isArray(item) ? item.map(fieldValue).filter((entry) => entry != null && entry !== "").join(", ") : fieldValue(item);
    if (value == null || value === "") return "";
    const fields = Array.isArray(item) ? item : [item];
    const source = fields.flatMap((field) => field.evidence || []).map((entry) => entry.originalText).filter(Boolean).join(" / ");
    const confidence = fields.length === 1 && Number.isFinite(fields[0].confidence) ? ` [AI confidence: ${Math.round(fields[0].confidence * 100)}%]` : "";
    return `${label}: ${value}${confidence}${source ? ` [Resume: ${source}]` : ""}`;
  };
  const renderList = (items, keys) => (items || []).map((item) => keys.map(([key, label]) => describe(label, item[key])).filter(Boolean).join(" · ")).filter(Boolean);
  const extra = [
    ...[["Full name", p.fullName], ["Middle name", p.middleName], ["Address", p.address], ["State", p.state], ["Country", p.country], ["Postal code", p.postalCode], ["Nationality", p.nationality], ["Date of birth", p.dateOfBirth], ["LinkedIn", p.linkedinUrl], ["GitHub", p.githubUrl], ["Portfolio", p.portfolioUrl], ["Website", p.websiteUrl]].map(([label, item]) => describe(label, item)),
    describe("Headline", work.headline), describe("Career objective", work.careerObjective), describe("Self-reported experience (years)", work.selfReportedExperienceYears),
    ...renderList(extracted.experience, [["title", "Title"], ["company", "Company"], ["startDate", "Start"], ["endDate", "End"], ["location", "Location"], ["responsibilities", "Responsibilities"], ["achievements", "Achievements"], ["technologies", "Technologies"]]),
    ...renderList(extracted.education, [["degree", "Degree"], ["specialization", "Specialization"], ["institution", "Institution"], ["university", "University"], ["passingYear", "Passing year"], ["grade", "Grade"]]),
    ...extracted.skills.map((item) => [describe("Skill", item.name), describe("Category", item.category), describe("Context", item.sourceSection), describe("Proficiency", item.proficiency)].filter(Boolean).join(" · ")).filter(Boolean),
    ...renderList(extracted.projects, [["name", "Project"], ["role", "Role"], ["organizationOrClient", "Organization/client"], ["description", "Description"], ["technologies", "Technologies"]]),
    ...renderList(extracted.certifications, [["name", "Certification"], ["issuer", "Issuer"], ["issueDate", "Issue date"], ["expiryDate", "Expiry date"]]),
    ...Object.entries(extracted.additionalInformation).flatMap(([section, items]) => items.map((item) => describe(section, item))).filter(Boolean),
    ...extracted.validationSummary.warnings.map((item) => describe("Warning", item)),
    ...extracted.discrepancies.map((item) => describe("Discrepancy", item.explanation)),
  ].filter(Boolean);
  return {
    fields: { ...Object.fromEntries(Object.entries(fieldMap).map(([key, item]) => [key, key === "skills" ? item : fieldValue(item)])), additional_details: extra.join("\n") },
    confidence, evidence,
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return send(response, 405, { error: "Method not allowed." });
  }
  const groqKey = process.env.GROQ_API_KEY;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!groqKey) return send(response, 503, { error: "Resume AI is not configured. Set the server-only GROQ_API_KEY." });
  if (!url || !publicKey || !secretKey) return send(response, 500, { error: "Resume parser requires the server Supabase URL, public key, and secret key." });

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return send(response, 401, { error: "Sign in is required." });
  const { organizationId, resumePath, fileName, contentType, fileSha256, text, images = [], fallbackFields = {} } = request.body || {};
  if (!UUID_PATTERN.test(organizationId || "") || typeof text !== "string" || text.length > 650000
    || !Array.isArray(images) || images.length > 3 || images.some((image) => !/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(image?.dataUrl || ""))
    || images.reduce((total, image) => total + (image?.dataUrl?.length || 0), 0) > 780000
    || (!text.trim() && !images.length)
    || typeof resumePath !== "string" || !resumePath.startsWith(`${organizationId}/`) || !SHA256_PATTERN.test(fileSha256 || "")) {
    return send(response, 400, { error: "A valid organization, uploaded resume, SHA-256 checksum, and complete resume text are required." });
  }

  const authClient = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const adminClient = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  if (authError || !authData.user) return send(response, 401, { error: "Your session is invalid or expired." });
  const [{ data: profile }, { data: membership }, { data: organization }] = await Promise.all([
    adminClient.from("profiles").select("role,status").eq("id", authData.user.id).maybeSingle(),
    adminClient.from("organization_memberships").select("role,status").eq("organization_id", organizationId).eq("user_id", authData.user.id).maybeSingle(),
    adminClient.from("organizations").select("status").eq("id", organizationId).maybeSingle(),
  ]);
  const active = String(profile?.status).toLowerCase() === "active";
  const isSuperadmin = profile?.role === "superadmin" && active;
  const isRecruiter = ["admin", "recruiter"].includes(membership?.role) && membership?.status === "active" && active;
  if (!organization || organization.status !== "active" || (!isSuperadmin && !isRecruiter)) return send(response, 403, { error: "You do not have recruiter access to this organization." });

  if (!resumePath.startsWith(`${organizationId}/${authData.user.id}/`)) return send(response, 403, { error: "This uploaded resume does not belong to your organization and account." });
  const { data: storedFile, error: storageError } = await adminClient.storage.from("candidate-resumes").download(resumePath);
  if (storageError || !storedFile) return send(response, 404, { error: "The uploaded resume could not be found in private storage." });
  const storedHash = createHash("sha256").update(Buffer.from(await storedFile.arrayBuffer())).digest("hex");
  if (storedHash !== fileSha256.toLowerCase()) return send(response, 400, { error: "Resume checksum did not match the uploaded file." });
  const { data: duplicate } = await adminClient.from("candidates").select("id").eq("organization_id", organizationId).eq("resume_sha256", fileSha256).maybeSingle();
  if (duplicate) return send(response, 409, { error: "This exact resume file is already in the Resume Pool." });

  const now = new Date().toISOString();
  const { data: run, error: runError } = await adminClient.from("resume_parse_runs").insert({
    organization_id: organizationId, created_by: authData.user.id, resume_path: resumePath,
    file_name: String(fileName || "Resume").slice(0, 255), content_type: String(contentType || "application/octet-stream").slice(0, 128),
    file_sha256: fileSha256, status: "UPLOADED", schema_version: "2.0", provider: process.env.LLM_PROVIDER || "groq",
    status_history: [{ status: "UPLOADED", at: now }],
  }).select("id").single();
  if (runError) return send(response, 500, { error: "Could not create the resume parsing history record." });
  const setRunStatus = async (status, values = {}) => {
    const { data: existingRun } = await adminClient.from("resume_parse_runs").select("status_history").eq("id", run.id).single();
    await adminClient.from("resume_parse_runs").update({
      ...values, status, updated_at: new Date().toISOString(),
      status_history: [...(existingRun?.status_history || []), { status, at: new Date().toISOString() }],
    }).eq("id", run.id);
  };
  await setRunStatus("AI_PROCESSING");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const provider = getLlmProvider();
    const generated = await provider.extractStructured({ text, images, schema: COMPACT_RESUME_SCHEMA, visionSchema: VISION_RESUME_SCHEMA, signal: controller.signal });
    await setRunStatus("VALIDATING", { model: generated.model, token_usage: generated.usage || {} });
    const extracted = normalizeAndValidate(normalizeExtractionShape(expandCompactExtraction(generated.data, images.length > 0)), fallbackFields);
    extracted.processingMetadata = { provider: provider.name, model: generated.model, schemaVersion: "2.0", usage: generated.usage };
    await setRunStatus("REVIEW_REQUIRED", { extraction: extracted, model: generated.model, token_usage: generated.usage || {}, completed_at: new Date().toISOString() });
    return send(response, 200, { ...uiFields(extracted), extracted, runId: run.id });
  } catch (error) {
    const message = error.message || "Could not parse this resume. Retry or enter details manually.";
    await setRunStatus("FAILED", { error: message.slice(0, 1000), completed_at: new Date().toISOString() });
    return send(response, error.status === 429 ? 429 : error.name === "AbortError" ? 504 : 502, { error: message, runId: run.id });
  } finally {
    clearTimeout(timeout);
  }
}

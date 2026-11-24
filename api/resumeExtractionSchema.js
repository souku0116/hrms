const object = (properties) => ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });
const evidence = object({ pageNumber: { type: ["integer", "null"] }, section: { type: "string" }, originalText: { type: "string" } });
const field = (type = ["string", "null"]) => object({
  value: { type }, normalizedValue: { type: ["string", "null"] },
  source: { type: "string", enum: ["EXPLICIT", "CONTEXTUAL", "INFERRED", "NOT_FOUND", "AMBIGUOUS"] },
  confidence: { type: "number" },
  validationStatus: { type: "string", enum: ["VALID", "INVALID", "NOT_VALIDATED", "CONFLICT_DETECTED", "NOT_FOUND", "REQUIRES_REVIEW"] },
  evidence: { type: "array", items: evidence },
});
const strings = { type: "array", items: field() };
const plainString = { type: ["string", "null"] };
const plainStrings = { type: "array", items: { type: "string" } };
const plainRecord = (properties) => object(properties);
const record = (properties) => object(Object.fromEntries(Object.entries(properties).map(([key, schema]) => [key, schema || field()])));

const compactWork = plainRecord({
  company: plainString, title: plainString, startDate: plainString, endDate: plainString, currentlyWorking: { type: ["boolean", "null"] },
  responsibilities: plainStrings, achievements: plainStrings, technologies: plainStrings,
});
const compactStudy = plainRecord({ degree: plainString, specialization: plainString, institution: plainString, passingYear: plainString, grade: plainString });
const compactSkill = plainRecord({ name: plainString, category: plainString, proficiency: plainString });
const compactProject = plainRecord({ name: plainString, description: plainString, technologies: plainStrings });
const compactCertificate = plainRecord({ name: plainString, issuer: plainString });

// A smaller, strict API schema keeps Groq's response predictable and well below TPM limits.
export const COMPACT_RESUME_SCHEMA = object({
  personalInformation: plainRecord({ fullName: plainString, firstName: plainString, lastName: plainString, email: plainString, phone: plainString, location: plainString, linkedinUrl: plainString }),
  professionalInformation: plainRecord({ currentDesignation: plainString, currentCompany: plainString, summary: plainString, selfReportedExperienceYears: { type: ["number", "null"] } }),
  experience: { type: "array", items: compactWork },
  education: { type: "array", items: compactStudy },
  skills: { type: "array", items: compactSkill },
  projects: { type: "array", items: compactProject },
  certifications: { type: "array", items: compactCertificate },
  additionalInformation: plainRecord({ languages: plainStrings, awards: plainStrings, publications: plainStrings, training: plainStrings }),
  validationSummary: plainRecord({ warnings: plainStrings, requiresReview: { type: "boolean" } }),
  coreEvidence: plainRecord({ fullName: { type: "string" }, email: { type: "string" }, phone: { type: "string" }, location: { type: "string" }, currentDesignation: { type: "string" }, currentCompany: { type: "string" }, skills: { type: "string" } }),
});

export const VISION_RESUME_SCHEMA = COMPACT_RESUME_SCHEMA;

export function expandCompactExtraction(compact) {
  const wrap = (value, section, evidenceText = "") => ({ value: value ?? null, normalizedValue: typeof value === "string" ? value : null,
    source: value == null ? "NOT_FOUND" : "EXPLICIT", confidence: evidenceText ? 0.85 : value == null ? 0 : 0.65,
    validationStatus: value == null ? "NOT_FOUND" : "NOT_VALIDATED", evidence: evidenceText ? [{ pageNumber: null, section, originalText: evidenceText }] : [] });
  const evidence = compact.coreEvidence || {};
  const personal = Object.fromEntries(Object.entries(compact.personalInformation || {}).map(([key, value]) => [key, wrap(value, "personal information", key === "fullName" ? evidence.fullName : key === "email" ? evidence.email : key === "phone" ? evidence.phone : key === "location" ? evidence.location : "")]));
  const professional = Object.fromEntries(Object.entries(compact.professionalInformation || {}).map(([key, value]) => [key, wrap(value, "professional information", key === "currentDesignation" ? evidence.currentDesignation : key === "currentCompany" ? evidence.currentCompany : "")]));
  const skills = (compact.skills || []).map((skill) => ({ ...skill, name: wrap(skill.name, "skills", evidence.skills) }));
  const blank = normalizeExtractionShape({});
  return {
    ...blank,
    personalInformation: { ...blank.personalInformation, ...personal, emails: fieldValue(personal.email) ? [personal.email] : [], phones: fieldValue(personal.phone) ? [personal.phone] : [], city: personal.location, linkedinUrl: personal.linkedinUrl },
    professionalInformation: { ...blank.professionalInformation, ...professional },
    experience: compact.experience || [], education: compact.education || [], skills, projects: compact.projects || [],
    certifications: compact.certifications || [],
    additionalInformation: { ...blank.additionalInformation, ...compact.additionalInformation, volunteerExperience: [], patents: [], memberships: [], achievements: [], references: [] },
    discrepancies: [], validationSummary: { ...blank.validationSummary, warnings: compact.validationSummary?.warnings || [], requiresReview: true },
    overallStatus: "REVIEW_REQUIRED",
  };
}

const contact = record({
  fullName: field(), firstName: field(), middleName: field(), lastName: field(), emails: strings, phones: strings,
  address: field(), city: field(), state: field(), country: field(), postalCode: field(), nationality: field(), dateOfBirth: field(),
  linkedinUrl: field(), githubUrl: field(), portfolioUrl: field(), websiteUrl: field(),
});
const professional = record({
  headline: field(), currentDesignation: field(), currentCompany: field(), previousDesignations: strings, careerObjective: field(), summary: field(),
  selfReportedExperienceYears: field(["number", "null"]), currentEmploymentStatus: field(), employmentPreference: field(),
  noticePeriod: field(), availability: field(), industry: field(), functionalDomain: field(), careerSpecialization: field(),
});
const employment = record({
  company: field(), title: field(), employmentType: field(), department: field(), startDate: field(), endDate: field(),
  currentlyWorking: field(["boolean", "null"]), location: field(), responsibilities: strings, achievements: strings,
  technologies: strings, tools: strings, projects: strings, client: field(),
});
const education = record({
  degree: field(), qualification: field(), specialization: field(), institution: field(), university: field(),
  startYear: field(), passingYear: field(), grade: field(), percentage: field(["number", "null"]),
  cgpa: field(["number", "null"]), gradingScale: field(), status: field(), location: field(),
});
const skill = record({
  name: field(), category: field(), sourceSection: field(), proficiency: field(),
});
const project = record({
  name: field(), description: field(), organizationOrClient: field(), role: field(), responsibilities: strings,
  technologies: strings, startDate: field(), endDate: field(), achievements: strings,
});
const certification = record({ name: field(), issuer: field(), credentialId: field(), issueDate: field(), expiryDate: field(), credentialUrl: field() });
const discrepancy = record({ field: field(), values: strings, explanation: field(), severity: field(), evidence: { type: "array", items: evidence } });

export const RESUME_SCHEMA = object({
  schemaVersion: { type: "string", enum: ["2.0"] },
  personalInformation: contact,
  professionalInformation: professional,
  experience: { type: "array", items: employment },
  education: { type: "array", items: education },
  skills: { type: "array", items: skill },
  projects: { type: "array", items: project },
  certifications: { type: "array", items: certification },
  additionalInformation: object({ languages: strings, awards: strings, publications: strings, patents: strings, volunteerExperience: strings, training: strings, memberships: strings, achievements: strings, references: strings }),
  discrepancies: { type: "array", items: discrepancy },
  validationSummary: object({ warnings: strings, requiresReview: { type: "boolean" } }),
  overallStatus: { type: "string", enum: ["REVIEW_REQUIRED"] },
});

function emptyValue(schema) {
  if (schema.type === "array") return [];
  if (schema.type === "object") return Object.fromEntries(Object.entries(schema.properties || {}).map(([key, child]) => [key, emptyValue(child)]));
  if (schema.enum) return schema.enum[0];
  if (Array.isArray(schema.type) && schema.type.includes("null")) return null;
  if (schema.type === "string") return "";
  if (schema.type === "boolean") return false;
  if (schema.type === "number" || schema.type === "integer") return 0;
  return null;
}

export function normalizeExtractionShape(value, schema = RESUME_SCHEMA) {
  if (schema.type === "array") return (Array.isArray(value) ? value : []).map((item) => normalizeExtractionShape(item, schema.items));
  if (schema.type !== "object") return value ?? emptyValue(schema);
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const props = schema.properties || {};
  const isField = Object.hasOwn(props, "value") && Object.hasOwn(props, "normalizedValue");
  if (isField && !(Object.hasOwn(input, "value") || Object.hasOwn(input, "normalizedValue"))) {
    return normalizeExtractionShape({ value: value ?? null, normalizedValue: typeof value === "string" || typeof value === "number" ? String(value) : null,
      source: value == null ? "NOT_FOUND" : "EXPLICIT", confidence: null,
      validationStatus: value == null ? "NOT_FOUND" : "NOT_VALIDATED", evidence: [] }, schema);
  }
  const normalized = Object.fromEntries(Object.entries(props).map(([key, child]) => [key, normalizeExtractionShape(input[key], child)]));
  if (isField) {
    if (!input.source) normalized.source = input.value == null ? "NOT_FOUND" : "EXPLICIT";
    if (!input.validationStatus) normalized.validationStatus = input.value == null ? "NOT_FOUND" : "NOT_VALIDATED";
    if (!Number.isFinite(input.confidence)) normalized.confidence = null;
  }
  return normalized;
}

export function fieldValue(field) {
  return field?.normalizedValue ?? field?.value ?? null;
}

function monthIndex(dateField, isEnd = false, currentlyWorking = false) {
  if (currentlyWorking || /present|current|now/i.test(String(dateField?.value || ""))) {
    const now = new Date();
    return now.getUTCFullYear() * 12 + now.getUTCMonth();
  }
  const raw = String(dateField?.normalizedValue || dateField?.value || "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})/);
  if (match && Number(match[2]) >= 1 && Number(match[2]) <= 12) return Number(match[1]) * 12 + Number(match[2]) - 1;
  // A year-only date does not identify a defensible month, so leave that role out.
  if (/^(19|20)\d{2}$/.test(raw)) return null;
  const named = raw.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (named) {
    const month = new Date(`${named[1]} 1, ${named[2]}`).getMonth();
    if (!Number.isNaN(month)) return Number(named[2]) * 12 + month;
  }
  return null;
}

export function calculateExperience(experience) {
  const periods = [];
  const warnings = [];
  for (const job of experience || []) {
    const start = monthIndex(job.startDate);
    const end = monthIndex(job.endDate, true, job.currentlyWorking?.value === true);
    if (start === null || end === null || end < start) {
      if (fieldValue(job.company) || fieldValue(job.title)) warnings.push("Some employment dates were incomplete or invalid; those periods were excluded from calculated experience.");
      continue;
    }
    periods.push([start, end]);
  }
  periods.sort((a, b) => a[0] - b[0]);
  let months = 0;
  let active = null;
  for (const period of periods) {
    if (!active || period[0] > active[1] + 1) {
      if (active) months += active[1] - active[0] + 1;
      active = [...period];
    } else active[1] = Math.max(active[1], period[1]);
  }
  if (active) months += active[1] - active[0] + 1;
  return { years: periods.length ? Math.round((months / 12) * 10) / 10 : null, warnings };
}

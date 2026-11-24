import supabase from "@/lib/supabaseClient";

export const RESUME_BUCKET = "candidate-resumes";
export const MAX_RESUME_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
]);

export function validateResumeFile(file) {
  if (!file) return "Choose a resume file to upload.";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_TYPES.has(file.type) || !["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png"].includes(ext)) {
    return "Upload a PDF, DOC, DOCX, TXT, JPG, JPEG, or PNG resume.";
  }
  if (file.size > MAX_RESUME_SIZE) return "Resume files must be 10 MB or smaller.";
  return "";
}

export async function hashResumeFile(file) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function uploadCandidateResume(file, organizationId, userId) {
  const error = validateResumeFile(file);
  if (error) throw new Error(error);
  const safeName = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "_").slice(-100);
  const path = `${organizationId}/${userId}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  return path;
}

export async function openCandidateResume(path, legacyUrl) {
  const tab = window.open("about:blank", "_blank");
  if (tab) tab.opener = null;
  if (!path && legacyUrl) {
    if (tab) tab.location = legacyUrl;
    else window.location.assign(legacyUrl);
    return;
  }
  const { data, error } = await supabase.storage.from(RESUME_BUCKET).createSignedUrl(path, 60);
  if (error) {
    tab?.close();
    throw error;
  }
  if (tab) tab.location = data.signedUrl;
  else window.location.assign(data.signedUrl);
}

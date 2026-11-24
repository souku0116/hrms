import { convertToHtml } from "mammoth";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const SKILL_TERMS = [
  "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", "Python", "Java", "C#", ".NET",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git",
  "HTML", "CSS", "Tailwind", "REST API", "GraphQL", "Machine Learning", "Data Analysis", "Excel",
  "Power BI", "Tableau", "Salesforce", "SAP", "Project Management", "Agile", "Scrum", "Recruiting",
  "Talent Acquisition", "Communication", "Leadership", "Figma", "UI/UX", "PHP", "C++", "Go", "Ruby",
];

async function readPdf(file) {
  const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = [];
    let previousY;
    for (const item of content.items) {
      const y = item.transform?.[5];
      if (previousY !== undefined && Number.isFinite(y) && Math.abs(y - previousY) > 2) lines.push("\n");
      lines.push(item.str);
      previousY = y;
    }
    pages.push(`[PAGE ${pageNumber}]\n${lines.join(" ").replace(/\s*\n\s*/g, "\n")}`);
  }
  return pages.join("\n");
}

export async function readResumeText(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return readPdf(file);
  if (extension === "docx") {
    const html = (await convertToHtml({ arrayBuffer: await file.arrayBuffer() })).value;
    return html.replace(/<\/(p|h[1-6]|tr|li)>/gi, "\n").replace(/<\/(td|th)>/gi, " | ").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n");
  }
  if (extension === "txt") return file.text();
  if (["jpg", "jpeg", "png"].includes(extension)) return "";
  throw new Error("Legacy DOC extraction is not configured. This file is uploaded for manual review.");
}

function canvasJpeg(source, maxWidth = 1050) {
  const ratio = Math.min(1, maxWidth / source.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width * ratio);
  canvas.height = Math.round(source.height * ratio);
  canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.48);
}

export async function readResumeImages(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png"].includes(extension)) {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    try {
      await image.decode();
      return [{ pageNumber: null, dataUrl: canvasJpeg(image) }];
    } finally {
      URL.revokeObjectURL(image.src);
    }
  }
  if (extension !== "pdf") return [];
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  if (pdf.numPages > 3) return [];
  const images = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.1 });
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1050 / viewport.width);
    canvas.width = Math.round(viewport.width * scale);
    canvas.height = Math.round(viewport.height * scale);
    await page.render({ canvas, canvasContext: canvas.getContext("2d"), viewport: page.getViewport({ scale: 1.1 * scale }) }).promise;
    images.push({ pageNumber, dataUrl: canvas.toDataURL("image/jpeg", 0.48) });
  }
  return images;
}

function labelledValue(text, labels) {
  const match = text.match(new RegExp(`(?:^|\\n)\\s*(?:${labels})\\s*[:|–-]\\s*([^\\n|]{2,100})`, "i"));
  return match?.[1]?.trim() || "";
}

function extractName(text) {
  const lines = text.split(/\n|\r/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const labelled = text.match(/(?:name|candidate)\s*[:|–-]\s*([A-Z][\p{L}'-]+(?:\s+[A-Z][\p{L}'-]+){1,3})/iu);
  const candidate = labelled?.[1] || lines.slice(0, 12).find((line) => {
    if (line.length > 60 || /@|resume|curriculum|profile|linkedin|phone|mobile|http|www\.|\d{3}/i.test(line)) return false;
    return /^[\p{Lu}][\p{L}'-]+(?:\s+[\p{Lu}][\p{L}'-]+){1,3}$/u.test(line);
  }) || "";
  const parts = candidate.trim().split(/\s+/);
  return {
    first_name: parts[0] || "",
    last_name: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

export function extractCandidateFields(text) {
  const normalized = text.replace(/\r/g, "\n").replace(/[\t\u00a0]+/g, " ").replace(/\n{3,}/g, "\n\n");
  const email = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = normalized.match(/(?:\+?\d[\d().\s-]{7,}\d)/)?.[0]?.replace(/\s+/g, " ").trim() || "";
  const name = extractName(normalized);
  const years = normalized.match(/(?:total\s+)?(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)\s*[:|-]?\s*(\d{1,2}(?:\.\d)?)/i)
    || normalized.match(/(\d{1,2}(?:\.\d)?)\s*\+?\s*years?\s+(?:of\s+)?experience/i);
  const skillsBlock = normalized.match(/(?:technical\s+)?skills\s*[:\n]([\s\S]{0,1200}?)(?=\n\s*(?:experience|employment|education|projects|certifications)\b|$)/i)?.[1] || "";
  const detectedSkills = SKILL_TERMS.filter((skill) => new RegExp(`(^|[^\\p{L}\\p{N}])${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}\\p{N}]|$)`, "iu").test(skillsBlock || normalized));
  return {
    ...name,
    email,
    phone,
    location: labelledValue(normalized, "location|address|city"),
    current_title: labelledValue(normalized, "current title|current position|designation|role|professional title"),
    current_company: labelledValue(normalized, "current company|employer|organization"),
    years_experience: years ? Number(years[1]) : "",
    skills: detectedSkills,
  };
}

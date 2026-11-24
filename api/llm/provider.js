import { extractStructured as extractWithGroq } from "./groqProvider.js";

export function getLlmProvider(name = process.env.LLM_PROVIDER || "groq") {
  if (name === "groq") return { name, extractStructured: extractWithGroq };
  throw new Error(`Unsupported resume LLM provider: ${name}`);
}

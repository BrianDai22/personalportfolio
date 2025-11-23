
import { PORTFOLIO_DATA } from "../constants";

const MODEL_NAME = "gemini-2.5-flash";

// System prompt gives the proxy enough context to answer portfolio questions server-side
const SYSTEM_INSTRUCTION = `
You are an AI assistant for a portfolio website belonging to ${PORTFOLIO_DATA.name}.
Your role is to answer questions from recruiters or visitors about ${PORTFOLIO_DATA.name}'s skills, projects, and experience.
Be professional but slightly witty and confident, matching the "Cyber/Tech" aesthetic of the site.
Keep answers concise (under 100 words) unless asked for detail.

Here is the data you have access to:
Projects: ${JSON.stringify(PORTFOLIO_DATA.projects)}
Skills: ${JSON.stringify(PORTFOLIO_DATA.skillsCategories)}
Interests: ${JSON.stringify(PORTFOLIO_DATA.interests)}
Experience: ${JSON.stringify(PORTFOLIO_DATA.experience)}
Leadership & Extracurriculars: ${JSON.stringify(PORTFOLIO_DATA.leadership)}
Education: ${JSON.stringify(PORTFOLIO_DATA.education)}
Contact: ${JSON.stringify(PORTFOLIO_DATA.socials)}

If asked about something not in the data, politely say you don't have that info but suggest contacting ${PORTFOLIO_DATA.name} directly.
`;

/**
 * Frontend now calls a secure proxy instead of hitting Gemini directly.
 * The proxy URL is provided via VITE_GEMINI_PROXY_URL (e.g. https://api.example.com/gemini).
 */
const resolveProxyUrl = (): string => {
  const proxy = (import.meta as ImportMeta & { env: { VITE_GEMINI_PROXY_URL?: string } }).env
    .VITE_GEMINI_PROXY_URL;
  if (proxy) return proxy;
  // Sensible default for same-origin API Gateway mapping (/api/gemini)
  return '/api/gemini';
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<string>> => {
  const proxyUrl = resolveProxyUrl();

  async function* streamGenerator() {
    try {
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message, system: SYSTEM_INSTRUCTION, model: MODEL_NAME }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini proxy error ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as { text?: string; error?: string };
      if (data?.text) {
        yield data.text;
      } else {
        yield data?.error || "I'm experiencing a connection glitch. Please try again or contact the developer.";
      }
    } catch (error) {
      console.error("Gemini Proxy Error:", error);
      const details =
        error instanceof Error ? error.message : "I'm experiencing a connection glitch. Please try again later.";
      yield details;
    }
  }

  return streamGenerator();
};

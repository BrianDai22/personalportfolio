
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PORTFOLIO_DATA } from "../constants";

// Construct a system prompt that gives the AI context about the portfolio owner
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

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

/**
 * Resolve the Gemini API key in a way that works for both Vite (browser) and Node.
 * Vite exposes env vars that start with VITE_ on import.meta.env at build time.
 */
const resolveApiKey = (): string => {
  // Vite build-time env (frontend)
  const viteKey =
    typeof import.meta !== "undefined" &&
    (import.meta as any)?.env?.VITE_GEMINI_API_KEY;

  if (viteKey) return viteKey as string;

  // Node/runtime env (server or tests)
  const nodeKey =
    typeof process !== "undefined" && process?.env?.GEMINI_API_KEY;

  if (nodeKey) return nodeKey;

  throw new Error(
    "Gemini API key missing. Add VITE_GEMINI_API_KEY to your .env.local (or GEMINI_API_KEY in Node)."
  );
};

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = resolveApiKey();
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const getChatSession = (): Chat => {
  const client = getAIClient();

  if (!chatSession) {
    chatSession = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 500, // Limit response size for faster, concise answers
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<string>> => {
  const chat = getChatSession();
  
  // We return an async generator that yields chunks of text
  async function* streamGenerator() {
    try {
      const result = await chat.sendMessageStream({ message });
      
      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        if (responseChunk.text) {
          yield responseChunk.text;
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      yield "I'm currently experiencing a connection glitch. Please try again later or contact the developer directly.";
    }
  }

  return streamGenerator();
};


import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PORTFOLIO_DATA } from '../constants';

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

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    // CRITICAL: Wrap environment variable access in a try-catch block
    // to prevent runtime crashes in browsers that don't shim 'process'.
    let apiKey = '';
    try {
      apiKey = process.env.API_KEY || '';
    } catch (e) {
      console.warn("process.env.API_KEY is not accessible in this environment.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

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

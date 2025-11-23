// Minimal Gemini proxy suitable for AWS Lambda + API Gateway
// Reads GEMINI_API_KEY from env; keeps key server-side.

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export const handler = async (event: any) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return json(500, { error: 'GEMINI_API_KEY missing on server' });
    }

    const body = event?.body ? JSON.parse(event.body) : {};
    const prompt: string = body.prompt;
    const system: string | undefined = body.system;
    const model: string = body.model || MODEL_NAME;

    if (!prompt || typeof prompt !== 'string') {
      return json(400, { error: 'prompt is required' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: system ? { role: 'system', parts: [{ text: system }] } : undefined,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500 },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return json(response.status, { error: `Gemini upstream error ${response.status}: ${text}` });
    }

    const data = (await response.json()) as any;
    const textParts: string[] = [];
    data.candidates?.forEach((candidate: any) => {
      candidate?.content?.parts?.forEach((part: any) => {
        if (typeof part.text === 'string' && part.text.length > 0) textParts.push(part.text);
      });
    });

    const combined = textParts.join('');
    return json(200, { text: combined || 'No content returned.' });
  } catch (error) {
    console.error('Gemini proxy error', error);
    return json(500, { error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

function json(statusCode: number, body: Record<string, unknown>) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(body),
  };
}

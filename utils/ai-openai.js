import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  // Point to OpenRouter API endpoint
  baseURL: 'https://openrouter.ai/api/v1',
  // Use the environment variable for the OpenRouter API key
  apiKey: process.env.OPENROUTER_API_KEY,
  // Required headers for OpenRouter (referer and app name)
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENROUTER_REFERRER || 'https://your-app.example.com',
    'HTTP-X-Title': process.env.OPENROUTER_APP_NAME || 'Dream Catcher',
  },
});

// Call the AI provider (OpenAI-compatible endpoint via OpenRouter)
export async function getDreamInterpretation(dreamText) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('Server misconfigured: OPENROUTER_API_KEY is missing');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    const message = await openai.chat.completions.create({
      model,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: 'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
        },
        {
          role: 'user',
          content: `Dream: ${dreamText}`
        }
      ]
    });
    return message.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`API error: ${error.message}`);
  }
}

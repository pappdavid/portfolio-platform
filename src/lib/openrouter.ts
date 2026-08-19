import { createOpenAI } from '@ai-sdk/openai';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export const PORTFOLIO_MODEL_ID =
  process.env.PORTFOLIO_CHAT_MODEL || 'deepseek/deepseek-v4-flash:free';

export function getPortfolioModel() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const openrouter = createOpenAI({
    name: 'openrouter',
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    headers: {
      'HTTP-Referer': 'https://davidpapp.dev',
      'X-Title': 'David Papp Portfolio'
    }
  });

  return openrouter.chat(PORTFOLIO_MODEL_ID);
}

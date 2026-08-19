import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const PORTFOLIO_GATEWAY_MODEL_ID =
  process.env.PORTFOLIO_CHAT_MODEL || 'deepseek/deepseek-v4-flash-0731';

export const PORTFOLIO_OPENROUTER_MODEL_ID =
  process.env.PORTFOLIO_OPENROUTER_MODEL || 'openrouter/free';

export function getPortfolioModel() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return PORTFOLIO_GATEWAY_MODEL_ID;

  const openrouter = createOpenRouter({
    apiKey,
    compatibility: 'strict',
    appName: 'David Papp Portfolio',
    appUrl: 'https://davidpapp.dev'
  });

  return openrouter.chat(PORTFOLIO_OPENROUTER_MODEL_ID);
}

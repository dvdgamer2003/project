import { MISTRAL_API_KEY } from '@/config/constants';

const API_URL = 'https://api.mistral.ai/v1/chat/completions';

interface MistralConfig {
  maxTokens?: number;
  temperature?: number;
}

export async function callMistralAPI(prompt: string, config: MistralConfig = {}) {
  if (!MISTRAL_API_KEY) {
    throw new Error('Mistral API key is not configured');
  }

  const { maxTokens = 300, temperature = 0.5 } = config;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Mistral API error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while calling Mistral API');
  }
}
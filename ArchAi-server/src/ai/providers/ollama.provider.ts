import OpenAI from 'openai';
import type { AIProviderConfig } from '../../types/architecture.types.js';
import type { AIProvider } from './base.js';

export class OllamaProvider implements AIProvider {
  public config: AIProviderConfig;
  private client: OpenAI;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.client = new OpenAI({
      baseURL: config.baseUrl ?? 'http://localhost:11434/v1',
      apiKey: 'ollama',
    });
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await this.client.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: 0.3,
    });

    return completion.choices[0]?.message.content ?? '';
  }
}

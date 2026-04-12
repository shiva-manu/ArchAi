import Anthropic from '@anthropic-ai/sdk';
import type { AIProviderConfig } from '../../types/architecture.types.js';
import type { AIProvider } from './base.js';

export class AnthropicProvider implements AIProvider {
  public config: AIProviderConfig;
  private client: Anthropic;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const message = await this.client.messages.create({
      model: this.config.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    return textBlock?.text ?? '';
  }
}

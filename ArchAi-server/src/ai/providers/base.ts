import { type AIProviderConfig } from '../../types/architecture.types.js';

export interface AIProvider {
  config: AIProviderConfig;
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
}

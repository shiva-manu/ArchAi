import { Router } from 'express';
import { ArchitectureController } from '../controllers/architecture.controller.js';
import { AIService } from '../ai/ai.service.js';
import { ArchitectureService } from '../services/architecture.service.js';
import { type AIProviderConfig } from '../types/architecture.types.js';

const router = Router();

const aiProvider = (process.env.AI_PROVIDER as AIProviderConfig['provider']) ?? 'groq';

if (!process.env.GROQ_API_KEY && !process.env.AI_API_KEY) {
  console.error(
    `[ArchiFlow] Missing API key. Set GROQ_API_KEY (or AI_API_KEY) in your .env file.`,
  );
}

const aiConfig: AIProviderConfig = {
  provider: aiProvider,
  apiKey: process.env.GROQ_API_KEY ?? process.env.AI_API_KEY,
  baseUrl: process.env.AI_BASE_URL,
  model: process.env.AI_MODEL ?? 'llama-3.3-70b-versatile',
};

const aiService = new AIService(aiConfig);
const architectureService = new ArchitectureService(aiService);
const architectureController = new ArchitectureController(architectureService);

router.post('/generate-architecture', architectureController.generateArchitecture);

// Streaming endpoint: generates build prompts one-by-one for each node
router.post('/generate-build-prompts', architectureController.generateBuildPromptsStream);

export default router;

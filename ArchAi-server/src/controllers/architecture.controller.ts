import { type Request, type Response, type NextFunction } from 'express';
import { ArchitectureService } from '../services/architecture.service.js';
import { type GenerateArchitectureInput, type ArchitectureResponse } from '../types/architecture.types.js';
import type { AIService } from '../ai/ai.service.js';

export class ArchitectureController {
  private architectureService: ArchitectureService;

  constructor(architectureService: ArchitectureService) {
    this.architectureService = architectureService;
  }

  generateArchitecture = async (
    req: Request<unknown, unknown, GenerateArchitectureInput>,
    res: Response<ArchitectureResponse | { error: string }>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const normalizedBody = (
        Array.isArray(req.body) &&
        req.body.length === 1 &&
        typeof req.body[0] === 'object' &&
        req.body[0] !== null
      )
        ? req.body[0]
        : req.body;

      // Generate architecture WITHOUT build prompts — prompts come separately
      const result = await this.architectureService.generateArchitecture(
        normalizedBody as GenerateArchitectureInput,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * SSE endpoint that streams build prompts one node at a time.
   */
  generateBuildPromptsStream = async (
    req: Request<unknown, unknown, { graph: ArchitectureResponse['graph']; architecture: ArchitectureResponse['architecture']; frontend: ArchitectureResponse['frontend'] }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { graph, architecture, frontend } = req.body;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders?.();

      let clientDisconnected = false;
      const onClose = () => {
        clientDisconnected = true;
      };

      req.on('close', onClose);

      try {
        // Access the aiService through the architectureService
        const aiService = (this.architectureService as unknown as { aiService: AIService }).aiService;
        const stream = aiService.generateBuildPromptsStream(graph, architecture, frontend);

        for await (const { nodeId, buildPrompt } of stream) {
          if (clientDisconnected) {
            break;
          }

          res.write(`event: prompt\ndata: ${JSON.stringify({ nodeId, prompt: buildPrompt })}\n\n`);
        }

        if (!clientDisconnected) {
          res.write(`event: done\ndata: {}\n\n`);
          res.end();
        }
      } finally {
        req.off?.('close', onClose);
      }
    } catch (error) {
      next(error);
    }
  };
}

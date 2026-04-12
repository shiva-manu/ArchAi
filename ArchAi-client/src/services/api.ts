import type {
  ArchitectureResponse,
  ApiImplementationGuide,
  ApiTechnology,
  ApiTechnologyStack,
  ApiDevelopmentStep,
  ApiEnvVar,
  ApiDeploymentGuide,
  ApiCostBreakdown,
  ApiCostEstimate,
} from '@/types'
import { logger } from '@/utils/logger'

export type {
  ArchitectureResponse,
  ApiImplementationGuide,
  ApiTechnology,
  ApiTechnologyStack,
  ApiDevelopmentStep,
  ApiEnvVar,
  ApiDeploymentGuide,
  ApiCostBreakdown,
  ApiCostEstimate,
}

export interface GenerateArchitectureInput {
  idea: string;
  scale: '1k' | '10k' | '100k' | '1M';
  constraints?: string[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function normalizeGenerateArchitectureInput(input: unknown): GenerateArchitectureInput {
  const candidate = Array.isArray(input) ? input[0] : input;

  if (!candidate || typeof candidate !== 'object') {
    throw new Error('Invalid architecture request payload');
  }

  const normalized = candidate as Partial<GenerateArchitectureInput>;

  return {
    idea: typeof normalized.idea === 'string' ? normalized.idea : '',
    scale: normalized.scale as GenerateArchitectureInput['scale'],
    constraints: Array.isArray(normalized.constraints)
      ? normalized.constraints.filter((constraint): constraint is string => typeof constraint === 'string')
      : [],
  };
}

export async function generateArchitecture(
  input: GenerateArchitectureInput
): Promise<ArchitectureResponse> {
  const normalizedInput = normalizeGenerateArchitectureInput(input);

  logger.debug('Sending architecture generation request', { ideaLength: normalizedInput.idea.length, scale: normalizedInput.scale });

  const response = await fetch(`${API_URL}/api/generate-architecture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(normalizedInput),
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Invalid JSON response from server (HTTP ${response.status})`);
  }

  if (!response.ok) {
    const errorData = data as Record<string, unknown>;
    logger.error('Architecture generation failed', { status: response.status, details: errorData.details });
    const errorMessage = errorData.details
      ? `Validation failed: ${JSON.stringify(errorData.details)}`
      : (errorData.error as string || `HTTP ${response.status}: ${response.statusText}`);
    throw new Error(errorMessage);
  }

  logger.debug('Architecture generation successful');
  return data as ArchitectureResponse;
}

/**
 * Stream build prompts via SSE. Calls back for each node's prompt.
 */
export async function streamBuildPrompts(
  graph: ArchitectureResponse['graph'],
  architecture: ArchitectureResponse['architecture'],
  frontend: ArchitectureResponse['frontend'] | undefined,
  onPrompt: (nodeId: string, prompt: string) => void,
  onDone: () => void,
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/generate-build-prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ graph, architecture, frontend }),
    });

    if (!response.ok) {
      logger.error('SSE stream request failed', { status: response.status });
      onDone();
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      logger.warn('SSE stream: no response body available');
      onDone();
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.nodeId && data.prompt) {
              onPrompt(data.nodeId, data.prompt);
            }
          } catch {
            logger.debug('SSE stream: skipped malformed data event');
          }
        } else if (line.startsWith('event: done')) {
          onDone();
          return;
        }
      }
    }
  } catch (err) {
    logger.error('SSE stream failed', { error: err instanceof Error ? err.message : 'Unknown error' });
  }

  onDone();
}

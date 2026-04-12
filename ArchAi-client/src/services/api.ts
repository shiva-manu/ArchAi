const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface GenerateArchitectureInput {
  idea: string;
  scale: '1k' | '10k' | '100k' | '1M';
  constraints?: string[];
}

export interface Technology {
  name: string;
  purpose: string;
  alternatives: string[];
  reason: string;
}

export interface TechnologyStack {
  frontend: Technology[];
  backend: Technology[];
  database: Technology[];
  infrastructure: Technology[];
  monitoring: Technology[];
}

export interface DevelopmentStep {
  phase: string;
  title: string;
  description: string;
  tasks: string[];
  estimatedDays: number;
  dependencies?: string[];
}

export interface EnvVar {
  name: string;
  description: string;
  example: string;
}

export interface DeploymentGuide {
  steps: string[];
  platforms: string[];
  environmentVariables: EnvVar[];
}

export interface CostBreakdown {
  service: string;
  cost: number;
  description: string;
}

export interface CostEstimate {
  monthly: number;
  breakdown: CostBreakdown[];
  assumptions: string;
}

export interface ImplementationGuide {
  projectStructure: string;
  developmentSteps: DevelopmentStep[];
  technologyStack: TechnologyStack;
  deploymentGuide: DeploymentGuide;
  costEstimate: CostEstimate;
  bestPractices: string[];
}

export interface ArchitectureResponse {
  requirements: {
    entities: string[];
    features: string[];
    users: string;
    constraints: string[];
  };
  architecture: {
    architectureType: 'monolith' | 'microservices';
    services: { name: string; description: string; tech: string[] }[];
    database: { type: 'SQL' | 'NoSQL'; reason: string };
    cache: { type: string; reason: string };
    queue: { type: string; reason: string };
  };
  frontend?: {
    framework: string;
    styling: string;
    stateManagement: string;
    pages: { name: string; path: string; description: string; components: string[]; features: string[] }[];
    components: { name: string; type: string; description: string; props?: string[]; state: string[]; apiCalls: string[] }[];
    layout: string;
    routing: string;
  };
  graph: {
    nodes: {
      id: string;
      type: string;
      position: { x: number; y: number };
      data: { label: string; description?: string | null; actions?: string[] | null; stepNumber?: number | null; group?: string | null; buildPrompt?: string | null };
    }[];
    edges: {
      id: string;
      source: string;
      target: string;
      label?: string | null;
      labelType?: 'read' | 'write' | 'replicate' | 'async' | 'sync' | 'push' | 'pull' | null;
      stepNumber?: number | null;
      style?: 'solid' | 'dashed' | null;
    }[];
  };
  explanation: {
    architectureExplanation: string;
    apiDesign: { route: string; method: string; description: string }[];
    scalingStrategy: string;
    tradeOffs: string[];
  };
  implementation?: ImplementationGuide;
}

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

  console.log('[API] Sending request:', JSON.stringify(normalizedInput, null, 2));

  const response = await fetch(`${API_URL}/api/generate-architecture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(normalizedInput),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[API] Error response:', JSON.stringify(data, null, 2));
    const errorMessage = data.details
      ? `Validation failed: ${JSON.stringify(data.details)}`
      : (data.error || `HTTP ${response.status}: ${response.statusText}`);
    throw new Error(errorMessage);
  }

  console.log('[API] Success response received');
  return data;
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
  const response = await fetch(`${API_URL}/api/generate-build-prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ graph, architecture, frontend }),
  });

  if (!response.ok) {
    console.error('[API] Stream error:', response.status);
    onDone();
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
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
          // Skip malformed data
        }
      } else if (line.startsWith('event: done')) {
        onDone();
        return;
      }
    }
  }

  onDone();
}

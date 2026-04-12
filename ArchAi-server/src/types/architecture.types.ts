export type Scale = '1k' | '10k' | '100k' | '1M';

export interface GenerateArchitectureInput {
  idea: string;
  scale: Scale;
  constraints?: string[];
}

export interface Requirement {
  entities: string[];
  features: string[];
  users: string;
  constraints: string[];
}

export interface Service {
  name: string;
  description: string;
  tech: string[];
}

export interface ArchitectureDecision {
  architectureType: 'monolith' | 'microservices';
  services: Service[];
  database: {
    type: 'SQL' | 'NoSQL';
    reason: string;
  };
  cache: {
    type: string;
    reason: string;
  };
  queue: {
    type: string;
    reason: string;
  };
}

export type EdgeLabelType = 'read' | 'write' | 'replicate' | 'async' | 'sync' | 'push' | 'pull';

export interface GraphNode {
  id: string;
  type: 'service' | 'database' | 'cache' | 'queue' | 'gateway' | 'external' | 'frontend' | 'notification' | 'cdn' | 'storage';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string | null;
    actions?: string[] | null;
    /** Step number shown as a callout circle on the node */
    stepNumber?: number | null;
    /** Group ID for region grouping (dashed border) */
    group?: string | null;
    /** The AI prompt that would build this specific component */
    buildPrompt?: string | null;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string | null;
  labelType?: EdgeLabelType | null;
  /** Step number shown as a circle on the edge flow path */
  stepNumber?: number | null;
  /** Style: 'solid' for direct flow, 'dashed' for background/async flow */
  style?: 'solid' | 'dashed' | null;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ApiDesign {
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  requestSchema?: string;
  responseSchema?: string;
  authentication?: boolean;
  rateLimit?: string;
}

export interface FrontendPage {
  name: string;
  path: string;
  description: string;
  components: string[];
  features: string[];
}

export interface UIComponent {
  name: string;
  type: string;
  description: string;
  props?: string[];
  state: string[];
  apiCalls: string[];
}

export interface FrontendArchitecture {
  framework: string;
  styling: string;
  stateManagement: string;
  pages: FrontendPage[];
  components: UIComponent[];
  layout: string;
  routing: string;
}

export interface Explanation {
  architectureExplanation: string;
  apiDesign: ApiDesign[];
  scalingStrategy: string;
  tradeOffs: string[];
}

export interface ImplementationGuide {
  projectStructure: string;
  developmentSteps: DevelopmentStep[];
  technologyStack: TechnologyStack;
  deploymentGuide: DeploymentGuide;
  costEstimate: CostEstimate;
  bestPractices: string[];
}

export interface DevelopmentStep {
  phase: string;
  title: string;
  description: string;
  tasks: string[];
  estimatedDays: number;
  dependencies?: string[];
}

export interface TechnologyStack {
  frontend: Technology[];
  backend: Technology[];
  database: Technology[];
  infrastructure: Technology[];
  monitoring: Technology[];
}

export interface Technology {
  name: string;
  purpose: string;
  alternatives: string[];
  reason: string;
}

export interface DeploymentGuide {
  steps: string[];
  platforms: string[];
  environmentVariables: EnvVar[];
}

export interface EnvVar {
  name: string;
  description: string;
  example: string;
}

export interface CostEstimate {
  monthly: number;
  breakdown: CostBreakdown[];
  assumptions: string;
}

export interface CostBreakdown {
  service: string;
  cost: number;
  description: string;
}

export interface ArchitectureResponse {
  requirements: Requirement;
  architecture: ArchitectureDecision;
  frontend: FrontendArchitecture;
  graph: Graph;
  explanation: Explanation;
  implementation?: ImplementationGuide;
}

export type AIProvider = 'groq' | 'anthropic' | 'ollama';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

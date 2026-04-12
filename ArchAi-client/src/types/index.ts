export type NodeType = 'frontend' | 'backend' | 'database' | 'cache' | 'queue' | 'gateway' | 'storage' | 'cdn' | 'service' | 'external' | 'notification';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface NodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  nodeType: NodeType;
  tech?: string;
  /** Short action labels shown on the node (e.g., "Upload", "Download") */
  actions?: string[];
  /** Step number shown as callout circle */
  stepNumber?: number;
  /** Group ID for region grouping (dashed border) */
  group?: string;
  /** The AI prompt that would build this component */
  buildPrompt?: string;
  /** Color accent for the node (derived from nodeType, but overrideable) */
  accent?: string;
}

export interface EdgeData extends Record<string, unknown> {
  label?: string;
  /** Semantic label type for color-coding: read | write | replicate | async | sync | push | pull */
  labelType?: 'read' | 'write' | 'replicate' | 'async' | 'sync' | 'push' | 'pull';
  animated?: boolean;
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface ApiEndpoint {
  route: string;
  method: HttpMethod;
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
  database: { type: 'SQL' | 'NoSQL'; reason: string };
  cache: { type: string; reason: string };
  queue: { type: string; reason: string };
}

export interface Explanation {
  architectureExplanation: string;
  apiDesign: ApiEndpoint[];
  scalingStrategy: string;
  tradeOffs: string[];
  frontend?: FrontendArchitecture;
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

export interface SystemDesign {
  requirements: Requirement;
  architecture: ArchitectureDecision;
  frontend?: FrontendArchitecture;
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
  explanation: Explanation;
  implementation?: ImplementationGuide;
}

export type UserScale = '1k' | '10k' | '100k' | '1M';

export interface DesignInput {
  idea: string;
  scale: UserScale;
  constraints?: string[];
}

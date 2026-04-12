import { z } from 'zod';

export const scaleEnum = z.enum(['1k', '10k', '100k', '1M']);

export const GenerateArchitectureSchema = z.object({
  idea: z.string().min(10).max(5000),
  scale: scaleEnum,
  constraints: z.array(z.string()).max(10).optional().default([]),
});

const unwrapGenerateArchitectureInput = (value: unknown): unknown => {
  if (
    Array.isArray(value) &&
    value.length === 1 &&
    typeof value[0] === 'object' &&
    value[0] !== null
  ) {
    return value[0];
  }

  return value;
};

export const GenerateArchitectureRequestSchema = z.preprocess(
  unwrapGenerateArchitectureInput,
  GenerateArchitectureSchema,
);

export type GenerateArchitectureInput = z.infer<typeof GenerateArchitectureSchema>;

// Step 1: Requirement Extraction
export const RequirementSchema = z.object({
  entities: z.array(z.string()),
  features: z.array(z.string()),
  users: z.string(),
  constraints: z.array(z.string()),
});

export type Requirement = z.infer<typeof RequirementSchema>;

// Step 2: Architecture Decision
export const ServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  tech: z.array(z.string()),
});

export const ArchitectureDecisionSchema = z.object({
  architectureType: z.enum(['monolith', 'microservices']),
  services: z.array(ServiceSchema),
  database: z.object({
    type: z.enum(['SQL', 'NoSQL']),
    reason: z.string(),
  }),
  cache: z.object({
    type: z.string(),
    reason: z.string(),
  }),
  queue: z.object({
    type: z.string(),
    reason: z.string(),
  }),
});

export type ArchitectureDecision = z.infer<typeof ArchitectureDecisionSchema>;

// Step 3: Graph Generator
export const GraphNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['service', 'database', 'cache', 'queue', 'gateway', 'external', 'frontend', 'notification', 'cdn', 'storage']),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    label: z.string(),
    description: z.string().nullish(),
    actions: z.array(z.string()).nullish(),
    stepNumber: z.number().nullish(),
    group: z.string().nullish(),
    buildPrompt: z.string().nullish(),
  }),
});

export const GraphEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().nullish(),
  labelType: z.enum(['read', 'write', 'replicate', 'async', 'sync', 'push', 'pull']).nullish(),
  stepNumber: z.number().nullish(),
  style: z.enum(['solid', 'dashed']).nullish(),
});

export const GraphSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
});

export type GraphNode = z.infer<typeof GraphNodeSchema>;
export type GraphEdge = z.infer<typeof GraphEdgeSchema>;
export type Graph = z.infer<typeof GraphSchema>;

// Step 4: Explanation Engine
export const ApiDesignSchema = z.object({
  route: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  description: z.string(),
  requestSchema: z.string().optional(),
  responseSchema: z.string().optional(),
  authentication: z.boolean().optional(),
  rateLimit: z.string().optional(),
});

// Frontend Architecture
export const FrontendPageSchema = z.object({
  name: z.string(),
  path: z.string(),
  description: z.string(),
  components: z.array(z.string()),
  features: z.array(z.string()),
});

export const UIComponentSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  props: z.array(z.string()).optional(),
  state: z.array(z.string()),
  apiCalls: z.array(z.string()),
});

export const FrontendArchitectureSchema = z.object({
  framework: z.string(),
  styling: z.string(),
  stateManagement: z.string(),
  pages: z.array(FrontendPageSchema),
  components: z.array(UIComponentSchema),
  layout: z.string(),
  routing: z.string(),
});

export const ExplanationSchema = z.object({
  architectureExplanation: z.string(),
  apiDesign: z.array(ApiDesignSchema),
  scalingStrategy: z.string(),
  tradeOffs: z.array(z.string()),
});

export type ApiDesign = z.infer<typeof ApiDesignSchema>;
export type FrontendPage = z.infer<typeof FrontendPageSchema>;
export type UIComponent = z.infer<typeof UIComponentSchema>;
export type FrontendArchitecture = z.infer<typeof FrontendArchitectureSchema>;
export type Explanation = z.infer<typeof ExplanationSchema>;

// Step 5: Implementation Guide
export const TechnologySchema = z.object({
  name: z.string(),
  purpose: z.string(),
  alternatives: z.array(z.string()),
  reason: z.string(),
});

export const TechnologyStackSchema = z.object({
  frontend: z.array(TechnologySchema),
  backend: z.array(TechnologySchema),
  database: z.array(TechnologySchema),
  infrastructure: z.array(TechnologySchema),
  monitoring: z.array(TechnologySchema),
});

export const DevelopmentStepSchema = z.object({
  phase: z.string(),
  title: z.string(),
  description: z.string(),
  tasks: z.array(z.string()),
  estimatedDays: z.number(),
  dependencies: z.array(z.string()).optional(),
});

export const EnvVarSchema = z.object({
  name: z.string(),
  description: z.string(),
  example: z.string(),
});

export const DeploymentGuideSchema = z.object({
  steps: z.array(z.string()),
  platforms: z.array(z.string()),
  environmentVariables: z.array(EnvVarSchema),
});

export const CostBreakdownSchema = z.object({
  service: z.string(),
  cost: z.number(),
  description: z.string(),
});

export const CostEstimateSchema = z.object({
  monthly: z.number(),
  breakdown: z.array(CostBreakdownSchema),
  assumptions: z.string(),
});

export const ImplementationGuideSchema = z.object({
  projectStructure: z.string(),
  developmentSteps: z.array(DevelopmentStepSchema),
  technologyStack: TechnologyStackSchema,
  deploymentGuide: DeploymentGuideSchema,
  costEstimate: CostEstimateSchema,
  bestPractices: z.array(z.string()),
});

export type Technology = z.infer<typeof TechnologySchema>;
export type TechnologyStack = z.infer<typeof TechnologyStackSchema>;
export type DevelopmentStep = z.infer<typeof DevelopmentStepSchema>;
export type EnvVar = z.infer<typeof EnvVarSchema>;
export type DeploymentGuide = z.infer<typeof DeploymentGuideSchema>;
export type CostBreakdown = z.infer<typeof CostBreakdownSchema>;
export type CostEstimate = z.infer<typeof CostEstimateSchema>;
export type ImplementationGuide = z.infer<typeof ImplementationGuideSchema>;

// Final Response
export const ArchitectureResponseSchema = z.object({
  requirements: RequirementSchema,
  architecture: ArchitectureDecisionSchema,
  frontend: FrontendArchitectureSchema,
  graph: GraphSchema,
  explanation: ExplanationSchema,
  implementation: ImplementationGuideSchema.optional(),
});

export type ArchitectureResponse = z.infer<typeof ArchitectureResponseSchema>;

// Error Response
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

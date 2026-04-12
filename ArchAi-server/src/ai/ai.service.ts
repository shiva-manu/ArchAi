import { type AIProviderConfig, type Requirement, type ArchitectureDecision, type Graph, type Explanation, type FrontendArchitecture, type ImplementationGuide } from '../types/architecture.types.js';
import { GroqProvider, AnthropicProvider, OllamaProvider } from './providers/index.js';
import type { AIProvider } from './providers/base.js';
import { extractJsonFromResponse } from '../utils/helpers.js';

export interface BatchRequest {
  id: string;
  prompt: string;
  systemPrompt?: string;
}

export interface BatchResult {
  id: string;
  result: string;
  error?: string;
}

export class AIService {
  private provider: AIProvider;

  constructor(config: AIProviderConfig) {
    switch (config.provider) {
      case 'groq':
        this.provider = new GroqProvider(config);
        break;
      case 'anthropic':
        this.provider = new AnthropicProvider(config);
        break;
      case 'ollama':
        this.provider = new OllamaProvider(config);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }

  async extractRequirements(idea: string, scale: string, constraints: string[]): Promise<Requirement> {
    const systemPrompt = `You are a senior systems analyst. Extract structured requirements from a product idea. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.`;

    const prompt = `
Convert the following product idea into structured requirements.

IDEA: ${idea}
TARGET SCALE: ${scale} concurrent users
CONSTRAINTS: ${constraints.join(', ') || 'None specified'}

Return a JSON object with this exact structure:
{
  "entities": ["list of key entities or domain objects"],
  "features": ["list of core features needed"],
  "users": "description of primary user personas",
  "constraints": ["list of technical constraints including the ones provided"]
}
`;

    const response = await this.provider.generateText(prompt, systemPrompt);
    return extractJsonFromResponse(response) as Requirement;
  }

  async generateArchitectureDecision(requirements: Requirement): Promise<ArchitectureDecision> {
    const systemPrompt = `You are a principal software architect. Design a system architecture based on the given requirements. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.`;

    const prompt = `
Design a system architecture based on these requirements:

ENTITIES: ${requirements.entities.join(', ')}
FEATURES: ${requirements.features.join(', ')}
USERS: ${requirements.users}
CONSTRAINTS: ${requirements.constraints.join(', ')}

Return a JSON object with this exact structure:
{
  "architectureType": "monolith or microservices",
  "services": [
    {
      "name": "Service Name",
      "description": "What this service does",
      "tech": ["technology1", "technology2"]
    }
  ],
  "database": {
    "type": "SQL or NoSQL",
    "reason": "Why this database was chosen"
  },
  "cache": {
    "type": "Cache technology (e.g., Redis)",
    "reason": "Why this cache was chosen"
  },
  "queue": {
    "type": "Queue technology (e.g., Kafka, RabbitMQ)",
    "reason": "Why this queue was chosen"
  }
}
`;

    const response = await this.provider.generateText(prompt, systemPrompt);
    return extractJsonFromResponse(response) as ArchitectureDecision;
  }

  async generateFrontendArchitecture(
    requirements: Requirement,
    architecture: ArchitectureDecision,
  ): Promise<FrontendArchitecture> {
    const systemPrompt = `You are a senior frontend architect. Design the complete frontend architecture for this application. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.`;

    const prompt = `
Design a comprehensive frontend architecture for this application:

PRODUCT CONTEXT:
- Entities: ${requirements.entities.join(', ')}
- Features: ${requirements.features.join(', ')}
- Target Users: ${requirements.users}

BACKEND ARCHITECTURE:
- Type: ${architecture.architectureType}
- Services: ${architecture.services.map(s => `${s.name} (${s.tech.join(', ')})`).join(', ')}

Return a JSON object with this EXACT structure:
{
  "framework": "Framework name (e.g., React 19, Vue 3, Next.js 15)",
  "styling": "Styling approach (e.g., Tailwind CSS, CSS Modules, styled-components)",
  "stateManagement": "State management solution (e.g., Zustand, Redux Toolkit, Pinia)",
  "pages": [
    {
      "name": "Page name",
      "path": "/route/path",
      "description": "What this page does",
      "components": ["Component1", "Component2"],
      "features": ["Feature this page supports"]
    }
  ],
  "components": [
    {
      "name": "Component name",
      "type": "page | component | layout | modal | form",
      "description": "What this component does",
      "props": ["prop1", "prop2"],
      "state": ["state1", "state2"],
      "apiCalls": ["/api/endpoint1", "/api/endpoint2"]
    }
  ],
  "layout": "Description of the overall layout structure (e.g., sidebar + main content, top nav + dashboard)",
  "routing": "Routing strategy (e.g., React Router with protected routes, Next.js App Router)"
}

CRITICAL REQUIREMENTS:
1. Include ALL pages needed for this application (login, dashboard, settings, etc.)
2. Include ALL reusable components (buttons, forms, modals, cards, tables, etc.)
3. Each component must list which API endpoints it calls
4. Pages must list which components they use
5. Be specific about the tech stack - name exact libraries
6. Include auth-related pages and components if needed
7. Include error handling components
8. Think about loading states and skeleton components
`;

    const response = await this.provider.generateText(prompt, systemPrompt);
    return extractJsonFromResponse(response) as FrontendArchitecture;
  }

  async generateGraph(architecture: ArchitectureDecision, frontend?: FrontendArchitecture): Promise<Graph> {
    return this.generateGraphSkeleton(architecture, frontend);
  }

  private async generateGraphSkeleton(architecture: ArchitectureDecision, frontend?: FrontendArchitecture): Promise<Graph> {
    const systemPrompt = `You are a visualization engineer. Convert an architecture decision into a React Flow compatible graph that looks like a professional system design infographic (similar to ByteByteGo / Instagram architecture diagrams). Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.`;

    const frontendContext = frontend ? `
FRONTEND:
- Framework: ${frontend.framework}
- Pages: ${frontend.pages.map(p => p.name).join(', ')}
` : '';

    const prompt = `
Convert this architecture into a numbered step-by-step system design diagram with groups and labeled flow arrows. DO NOT include build prompts — those will be generated separately.

ARCHITECTURE TYPE: ${architecture.architectureType}
SERVICES: ${architecture.services.map((s) => `${s.name} (${s.tech.join(', ')})`).join('; ')}
DATABASE: ${architecture.database.type}
CACHE: ${architecture.cache.type}
QUEUE: ${architecture.queue.type}
${frontendContext}

Available node types: "frontend", "gateway", "service", "database", "cache", "queue", "external", "cdn", "storage", "notification"

Edge label types (color-coded):
- "read" → blue
- "write" → green
- "replicate" → orange
- "async" → purple
- "sync" → cyan
- "push" → amber
- "pull" → teal

=== GROUPS (dashed border regions) ===
Define these logical groups by setting "data.group" on nodes:
- "client" → Frontend apps, mobile clients, web browsers
- "backend" → API server, backend services
- "data" → Databases, cache, storage
- "infra" → CDN, load balancer, external services
- "workers" → Background workers, queue processors, notification service

=== STEP NUMBERS ===
Number each edge with "stepNumber" (1, 2, 3, ...) showing the flow of a request through the system. Step 1 is always the client hitting the API. Number edges sequentially following the data flow path.

=== LAYOUT RULES ===
Spread nodes like a real architecture infographic:
- Client Devices group at top: y=-250 to -150
- CDN / Object Storage at left: x=-100, y=-50 to 50
- API Gateway at center-top: x=300, y=-50
- Backend Server at center: x=300, y=80
- Services around backend: x=100 to 500, y=80
- Databases at bottom-left: x=100, y=250
- Cache at bottom-center: x=300, y=250
- Queue at bottom-right: x=500, y=250
- Background Workers at far right: x=650, y=150
- Notification Server at right: x=650, y=0

Each node position must have DISTINCT x and y values.

=== RESPONSE STRUCTURE ===
Return a JSON object with this exact structure:
{
  "nodes": [
    {
      "id": "unique_id",
      "type": "node_type",
      "position": { "x": number, "y": number },
      "data": {
        "label": "Short Label (e.g., API, CDN, SQL)",
        "description": "Very short: 2-4 words",
        "actions": ["Action1"],
        "stepNumber": 1,
        "group": "backend"
      }
    }
  ],
  "edges": [
    {
      "id": "e_source_target",
      "source": "source_id",
      "target": "target_id",
      "label": "Optional short label",
      "labelType": "sync",
      "stepNumber": 1,
      "style": "solid"
    }
  ]
}

=== REQUIRED NODES (adapt to the architecture) ===
1. Frontend clients (mobile/web) in "client" group
2. CDN in "infra" group
3. API Gateway / API in "backend" group
4. Backend Server in "backend" group
5. Object Storage (S3/Cloud) in "data" group for media
6. Relational Database (SQL) in "data" group
7. NoSQL Database in "data" group if needed
8. Cache (Redis/Memcached) in "data" group
9. Queue (Kafka/RabbitMQ) in "data" group
10. Background Workers in "workers" group
11. Notification Service in "workers" group if real-time features
12. Feed/Analytics service if needed

=== EDGE REQUIREMENTS ===
- Number edges sequentially (1, 2, 3...) following request flow
- Use "solid" style for primary request flow
- Use "dashed" style for background/async flows (queue → workers, cache refresh, replication)
- Use appropriate labelType for color-coding
- Create a numbered path from client → API → services → databases
- Include background async paths (queue → workers → notifications)

Make the diagram tell a clear story: how a user request flows through the system step by step.
`;

    const response = await this.provider.generateText(prompt, systemPrompt);
    const graph = extractJsonFromResponse(response) as Graph;
    return this.applyGridLayout(graph, !!frontend);
  }

  /**
   * Generate build prompts sequentially — each prompt is generated with context
   * from all previously generated prompts, creating a coherent chain.
   * Returns an async generator that yields { nodeId, buildPrompt } one at a time.
   */
  async *generateBuildPromptsStream(
    graph: Graph,
    architecture: ArchitectureDecision,
    frontend?: FrontendArchitecture,
  ): AsyncGenerator<{ nodeId: string; buildPrompt: string }, void, void> {
    // Sort nodes by stepNumber (or position order if no stepNumber)
    const sortedNodes = [...graph.nodes].sort((a, b) => {
      const aStep = a.data.stepNumber ?? 999;
      const bStep = b.data.stepNumber ?? 999;
      return aStep - bStep || a.position.y - b.position.y;
    });

    let promptContext = '';

    for (const node of sortedNodes) {
      const buildPrompt = await this.generateSingleBuildPrompt(
        node,
        graph,
        architecture,
        frontend,
        promptContext,
      );

      yield { nodeId: node.id, buildPrompt };

      // Build context for next node
      promptContext += `\n- ${node.data.label} (${node.type}): ${buildPrompt}`;
    }
  }

  private async generateSingleBuildPrompt(
    node: (typeof graph.nodes)[0],
    graph: Graph,
    architecture: ArchitectureDecision,
    frontend: FrontendArchitecture | undefined,
    previousContext: string,
  ): Promise<string> {
    const systemPrompt = `You are an expert technical lead writing detailed build prompts for each component in a system architecture. Each prompt must be specific, actionable, and contextual — describing exactly what to build for THIS product. Return ONLY the prompt text. No JSON, no markdown, no explanations.`;

    // Find connected nodes for context
    const incomingEdges = graph.edges.filter((e) => e.target === node.id);
    const outgoingEdges = graph.edges.filter((e) => e.source === node.id);
    const upstreamNodes = incomingEdges.map((e) => graph.nodes.find((n) => n.id === e.source)).filter(Boolean);
    const downstreamNodes = outgoingEdges.map((e) => graph.nodes.find((n) => n.id === e.target)).filter(Boolean);

    const prompt = `
Write a detailed build prompt for the following component in the architecture.

=== COMPONENT TO BUILD ===
Node: ${node.data.label}
Type: ${node.type}
Description: ${node.data.description || 'N/A'}
Actions: ${(node.data.actions || []).join(', ')}
Group: ${node.data.group || 'N/A'}

=== ARCHITECTURE CONTEXT ===
Product: ${architecture.services.map((s) => s.name).join(', ')}
Database: ${architecture.database.type}
Cache: ${architecture.cache.type}
Queue: ${architecture.queue.type}
${frontend ? `Frontend: ${frontend.framework}` : ''}

=== CONNECTED COMPONENTS ===
Receives data from: ${upstreamNodes.map((n) => n?.data.label || 'unknown').join(', ')}
Sends data to: ${downstreamNodes.map((n) => n?.data.label || 'unknown').join(', ')}

=== PREVIOUS COMPONENTS (already built) ===
${previousContext || 'None — this is the first component.'}

=== REQUIREMENTS ===
Write a 3-5 sentence build prompt that:
1. Describes EXACTLY what to build for this specific product (not generic)
2. Mentions specific technologies, frameworks, and integrations
3. Describes the key features and data flows this component handles
4. References how it connects to upstream/downstream components
5. Includes relevant technical details (auth, caching, error handling, etc.)

Example for a Trip Service in an Uber-like app:
"Build a Node.js microservice with Express and PostgreSQL for managing the full trip lifecycle: request trip, match driver via geospatial query, track live location via WebSockets, calculate fare with distance/time algorithms, handle trip completion and rating flow. Integrate with the Driver Service for availability checks and the Payment Service for fare processing. Include real-time ETA calculation using the Haversine formula and Redis caching for nearby driver lookups with 5-second TTL."

Write the prompt for: ${node.data.label}
`;

    const response = await this.provider.generateText(prompt, systemPrompt);
    return response.trim();
  }

  private applyGridLayout(graph: Graph, hasFrontend: boolean): Graph {
    const nodeCount = graph.nodes.length;
    const cols = Math.min(3, nodeCount);
    const nodeWidth = 200;
    const nodeHeight = 120;
    const offsetY = hasFrontend ? 150 : 0;

    const nodesWithLayout = graph.nodes.map((node, index) => {
      // Keep frontend at top if it exists
      if (node.type === 'frontend') {
        return {
          ...node,
          position: { x: 400, y: -150 },
        };
      }
      
      // Adjust other nodes based on frontend presence
      const col = index % cols;
      const row = Math.floor(index / cols);
      return {
        ...node,
        position: {
          x: col * (nodeWidth + 50) + 50,
          y: row * (nodeHeight + 60) + 20 + offsetY,
        },
      };
    });

    return { ...graph, nodes: nodesWithLayout };
  }

  async generateExplanation(
    architecture: ArchitectureDecision,
    requirements: Requirement,
    frontend: FrontendArchitecture,
  ): Promise<Explanation> {
    const systemPrompt = `You are a technical writer. Explain the architecture decisions in clear, human-readable text. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.`;

    const prompt = `
Write a detailed explanation for this full-stack architecture:

FRONTEND:
- Framework: ${frontend.framework}
- Styling: ${frontend.styling}
- State Management: ${frontend.stateManagement}
- Pages: ${frontend.pages.map(p => p.name).join(', ')}

BACKEND ARCHITECTURE TYPE: ${architecture.architectureType}
SERVICES: ${JSON.stringify(architecture.services, null, 2)}
DATABASE: ${architecture.database.type} — ${architecture.database.reason}
CACHE: ${architecture.cache.type} — ${architecture.cache.reason}
QUEUE: ${architecture.queue.type} — ${architecture.queue.reason}
CONSTRAINTS: ${requirements.constraints.join(', ')}

Return a JSON object with this exact structure:
{
  "architectureExplanation": "Detailed explanation of the overall architecture covering both frontend and backend",
  "apiDesign": [
    {
      "route": "/api/example/resource",
      "method": "POST",
      "description": "What this endpoint does and which frontend component uses it",
      "requestSchema": "Request body format description",
      "responseSchema": "Response body format description",
      "authentication": true,
      "rateLimit": "100 requests per minute"
    }
  ],
  "scalingStrategy": "How this system scales for the target load",
  "tradeOffs": ["list of trade-offs made in this design"]
}

CRITICAL API REQUIREMENTS:
1. Include at least 8-12 API endpoints relevant to ALL services and frontend pages
2. Each endpoint must specify:
   - Exact route with parameters (e.g., /api/users/:id)
   - HTTP method
   - What it does
   - What the request body looks like (requestSchema)
   - What the response body looks like (responseSchema)
   - Whether it requires authentication
   - Rate limiting if applicable
3. Cover CRUD operations for all major entities
4. Include auth endpoints (login, register, logout)
5. Include pagination, filtering, and search endpoints if relevant
6. Include real-time endpoints if applicable (WebSockets, SSE)
7. Include file upload endpoints if needed
`;

    const response = await this.provider.generateText(prompt, systemPrompt);
    return extractJsonFromResponse(response) as Explanation;
  }

  async generateImplementationGuide(
    architecture: ArchitectureDecision,
    requirements: Requirement,
    explanation: Explanation,
  ): Promise<ImplementationGuide> {
    const systemPrompt = `You are an expert technical lead and mentor. Create a comprehensive implementation guide for building this system from scratch. The guide should be detailed enough for a beginner to follow. Return ONLY valid JSON. No markdown, no explanations. IMPORTANT: Do not use actual newline characters inside string values. Use \\n instead if you need line breaks within strings. All string values must be single-line strings.`;

    const prompt = `
Create a complete implementation guide for building this system:

PRODUCT IDEA CONTEXT:
- Entities: ${requirements.entities.join(', ')}
- Features: ${requirements.features.join(', ')}
- Target Users: ${requirements.users}
- Architecture Type: ${architecture.architectureType}

TECHNOLOGY STACK:
- Services: ${architecture.services.map((s) => `${s.name} (${s.tech.join(', ')})`).join(', ')}
- Database: ${architecture.database.type} (${architecture.database.reason})
- Cache: ${architecture.cache.type} (${architecture.cache.reason})
- Queue: ${architecture.queue.type} (${architecture.queue.reason})

KEY API ENDPOINTS:
${explanation.apiDesign.map((api) => `${api.method} ${api.route} - ${api.description}`).join('\n')}

SCALING STRATEGY: ${explanation.scalingStrategy}

TRADE-OFFS: ${explanation.tradeOffs.join(', ')}

Return a JSON object with this EXACT structure:
{
  "projectStructure": "Complete folder structure as a formatted string showing all directories and key files for the entire project (frontend, backend, services, infrastructure). Use ASCII tree format.",
  
  "developmentSteps": [
    {
      "phase": "Phase number and name (e.g., 'Phase 1: Foundation')",
      "title": "Short title for this phase",
      "description": "Detailed description of what to build and why",
      "tasks": ["Specific actionable task 1", "Specific actionable task 2", "..."],
      "estimatedDays": 3,
      "dependencies": ["Previous phase titles this depends on"]
    }
  ],
  
  "technologyStack": {
    "frontend": [
      {
        "name": "Technology name",
        "purpose": "What it's used for",
        "alternatives": ["Alternative 1", "Alternative 2"],
        "reason": "Why this technology was chosen"
      }
    ],
    "backend": [...],
    "database": [...],
    "infrastructure": [...],
    "monitoring": [...]
  },
  
  "deploymentGuide": {
    "steps": ["Step 1: Detailed deployment instruction", "Step 2: ..."],
    "platforms": ["Recommended hosting platforms"],
    "environmentVariables": [
      {
        "name": "ENV_VAR_NAME",
        "description": "What this variable does",
        "example": "example_value"
      }
    ]
  },
  
  "costEstimate": {
    "monthly": 150,
    "breakdown": [
      {
        "service": "Service name (e.g., AWS EC2)",
        "cost": 50,
        "description": "What this cost covers"
      }
    ],
    "assumptions": "What assumptions this estimate is based on (e.g., 'Based on 10K monthly active users')"
  },
  
  "bestPractices": ["Best practice 1", "Best practice 2", "..."]
}

CRITICAL GUIDELINES:
1. Project structure must show COMPLETE folder hierarchy including frontend, all backend services, shared packages, infra configs
2. Development steps must be sequential and build upon each other - a complete roadmap from zero to production
3. Each task in developmentSteps.tasks must be SPECIFIC and ACTIONABLE (e.g., "Set up Express.js server with CORS and rate limiting" not "Build backend")
4. Technology stack must include alternatives so users can make informed choices
5. Deployment guide must be step-by-step, covering everything from local dev to production
6. Cost estimate should be realistic for the target scale
7. Include at least 6-8 development phases
8. Best practices should cover security, performance, maintainability, and team collaboration
`;

    const response = await this.provider.generateText(prompt, systemPrompt);
    return extractJsonFromResponse(response) as ImplementationGuide;
  }

  /**
   * Fire multiple independent LLM requests in parallel.
   * Groq supports high throughput — we batch requests with Promise.all.
   */
  async generateBatch(requests: BatchRequest[]): Promise<BatchResult[]> {
    const results = await Promise.allSettled(
      requests.map((req) =>
        this.provider.generateText(req.prompt, req.systemPrompt)
          .then((result) => ({ id: req.id, result }))
          .catch((error) => ({ id: req.id, result: '', error: error.message }))
      )
    );

    return results.map((r) =>
      r.status === 'fulfilled'
        ? r.value
        : { id: 'unknown', result: '', error: 'Promise rejected' }
    );
  }
}

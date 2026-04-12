// AI prompts used for generating each part of the architecture
// These are shown to users when they hover over system design terms

export const architecturePrompts = {
  requirements: {
    title: 'Requirement Extraction Prompt',
    prompt: `You are a senior systems analyst. Extract structured requirements from a product idea. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.

Convert the following product idea into structured requirements.

IDEA: {idea}
TARGET SCALE: {scale} concurrent users
CONSTRAINTS: {constraints}

Return a JSON object with this exact structure:
{
  "entities": ["list of key entities or domain objects"],
  "features": ["list of core features needed"],
  "users": "description of primary user personas",
  "constraints": ["list of technical constraints including the ones provided"]
}`,
  },

  architecture: {
    title: 'Architecture Design Prompt',
    prompt: `You are a principal software architect. Design a system architecture based on the given requirements. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.

Design a system architecture based on these requirements:

ENTITIES: {entities}
FEATURES: {features}
USERS: {users}
CONSTRAINTS: {constraints}

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
}`,
  },

  frontend: {
    title: 'Frontend Architecture Prompt',
    prompt: `You are a senior frontend architect. Design the complete frontend architecture for this application. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.

Design a comprehensive frontend architecture for this application:

PRODUCT CONTEXT:
- Entities: {entities}
- Features: {features}
- Target Users: {users}

BACKEND ARCHITECTURE:
- Type: {architectureType}
- Services: {services}

Return a JSON object with this EXACT structure:
{
  "framework": "Framework name (e.g., React 19, Vue 3, Next.js 15)",
  "styling": "Styling approach (e.g., Tailwind CSS, CSS Modules, styled-components)",
  "stateManagement": "State management solution (e.g., Zustand, Redux Toolkit, Pinia)",
  "pages": [...],
  "components": [...],
  "layout": "Description of the overall layout structure",
  "routing": "Routing strategy (e.g., React Router with protected routes, Next.js App Router)"
}

CRITICAL REQUIREMENTS:
1. Include ALL pages needed for this application
2. Include ALL reusable components
3. Each component must list which API endpoints it calls
4. Pages must list which components they use
5. Be specific about the tech stack - name exact libraries
6. Include auth-related pages and components if needed
7. Include error handling components
8. Think about loading states and skeleton components`,
  },

  graph: {
    title: 'Graph Generation Prompt',
    prompt: `You are a visualization engineer. Convert an architecture decision into a React Flow compatible graph. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations. The response must start with { and end with }.

Convert this architecture decision into a React Flow graph.

ARCHITECTURE TYPE: {architectureType}
SERVICES: {services}
DATABASE: {database}
CACHE: {cache}
QUEUE: {queue}

CRITICAL: Every node MUST have a UNIQUE position. Spread nodes across the canvas using a grid layout.
DO NOT set all nodes to {x:0, y:0}. Use these rules:
- Frontend App at {x:400, y:-150} (if frontend exists)
- API Gateway at {x:400, y:0}
- Services in a horizontal row at y=150, spaced 200px apart
- Database, cache, queue at y=300, spaced 200px apart
- External services at y=450

Each position must have DISTINCT x and y values.

Node types: "service", "database", "cache", "queue", "gateway", "external", "frontend"`,
  },

  api: {
    title: 'API Design Prompt',
    prompt: `You are a technical writer. Explain the architecture decisions in clear, human-readable text. Return ONLY a valid JSON OBJECT (not an array). No markdown, no explanations.

Write a detailed explanation for this full-stack architecture:

FRONTEND:
- Framework: {framework}
- Styling: {styling}
- State Management: {stateManagement}
- Pages: {pages}

BACKEND ARCHITECTURE TYPE: {architectureType}
SERVICES: {services}
DATABASE: {database} — {databaseReason}
CACHE: {cache} — {cacheReason}
QUEUE: {queue} — {queueReason}

Return API design with this structure:
{
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
  ]
}

CRITICAL API REQUIREMENTS:
1. Include at least 8-12 API endpoints relevant to ALL services and frontend pages
2. Each endpoint must specify route, method, description, request/response schemas, auth, rate limiting
3. Cover CRUD operations for all major entities
4. Include auth endpoints (login, register, logout)
5. Include pagination, filtering, and search endpoints if relevant
6. Include real-time endpoints if applicable (WebSockets, SSE)`,
  },

  scaling: {
    title: 'Scaling Strategy Prompt',
    prompt: `You are a technical writer. Explain the architecture decisions in clear, human-readable text. Return ONLY a valid JSON OBJECT (not an array).

Write a detailed explanation for this full-stack architecture including scaling strategy:

FRONTEND:
- Framework: {framework}
- Styling: {styling}
- State Management: {stateManagement}

BACKEND ARCHITECTURE TYPE: {architectureType}
SERVICES: {services}
DATABASE: {database} — {databaseReason}
CACHE: {cache} — {cacheReason}
QUEUE: {queue} — {queueReason}
CONSTRAINTS: {constraints}

Return a JSON object with this exact structure:
{
  "architectureExplanation": "Detailed explanation of the overall architecture",
  "apiDesign": [...],
  "scalingStrategy": "How this system scales for the target load",
  "tradeOffs": ["list of trade-offs made in this design"]
}`,
  },

  implementation: {
    title: 'Implementation Guide Prompt',
    prompt: `You are an expert technical lead and mentor. Create a comprehensive implementation guide for building this system from scratch. The guide should be detailed enough for a beginner to follow. Return ONLY valid JSON.

Create a complete implementation guide for building this system:

PRODUCT IDEA CONTEXT:
- Entities: {entities}
- Features: {features}
- Target Users: {users}
- Architecture Type: {architectureType}

TECHNOLOGY STACK:
- Services: {services}
- Database: {database} ({databaseReason})
- Cache: {cache} ({cacheReason})
- Queue: {queue} ({queueReason})

KEY API ENDPOINTS: {apiEndpoints}
SCALING STRATEGY: {scalingStrategy}

Return a JSON object with this EXACT structure:
{
  "projectStructure": "Complete folder structure as a formatted string showing all directories and key files",
  "developmentSteps": [
    {
      "phase": "Phase number and name",
      "title": "Short title for this phase",
      "description": "Detailed description of what to build and why",
      "tasks": ["Specific actionable task 1", "..."],
      "estimatedDays": 3,
      "dependencies": ["Previous phase titles this depends on"]
    }
  ],
  "technologyStack": {
    "frontend": [...],
    "backend": [...],
    "database": [...],
    "infrastructure": [...],
    "monitoring": [...]
  },
  "deploymentGuide": {
    "steps": ["Step 1: Detailed deployment instruction", "..."],
    "platforms": ["Recommended hosting platforms"],
    "environmentVariables": [...]
  },
  "costEstimate": {
    "monthly": 150,
    "breakdown": [...],
    "assumptions": "What assumptions this estimate is based on"
  },
  "bestPractices": ["Best practice 1", "..."]
}

CRITICAL GUIDELINES:
1. Project structure must show COMPLETE folder hierarchy
2. Development steps must be sequential and build upon each other
3. Each task must be SPECIFIC and ACTIONABLE
4. Technology stack must include alternatives
5. Deployment guide must be step-by-step
6. Include at least 6-8 development phases
7. Best practices should cover security, performance, maintainability, and team collaboration`,
  },
} as const

export type PromptKey = keyof typeof architecturePrompts

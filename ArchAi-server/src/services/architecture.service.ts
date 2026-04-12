import { AIService } from '../ai/ai.service.js';
import { type GenerateArchitectureInput, type ArchitectureResponse, type Requirement, type ArchitectureDecision, type Graph, type Explanation, type FrontendArchitecture, type ImplementationGuide } from '../types/architecture.types.js';
import { GenerateArchitectureRequestSchema, RequirementSchema, ArchitectureDecisionSchema, GraphSchema, FrontendArchitectureSchema, ExplanationSchema, ImplementationGuideSchema } from '../schemas/architecture.schema.js';

export class ArchitectureService {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async generateArchitecture(
    input: GenerateArchitectureInput,
  ): Promise<ArchitectureResponse> {
    const validatedInput = GenerateArchitectureRequestSchema.parse(input);

    // Step 1: Requirement Extraction
    const rawRequirements = await this.aiService.extractRequirements(
      validatedInput.idea,
      validatedInput.scale,
      validatedInput.constraints ?? [],
    );
    const requirements = RequirementSchema.parse(rawRequirements);

    // Step 2: Architecture Decision Engine
    const rawArchitecture = await this.aiService.generateArchitectureDecision(
      requirements,
    );
    const architecture = ArchitectureDecisionSchema.parse(rawArchitecture);

    // Step 3: Frontend Architecture Generation
    const rawFrontend = await this.aiService.generateFrontendArchitecture(
      requirements,
      architecture,
    );
    const frontend = FrontendArchitectureSchema.parse(rawFrontend);

    // Step 4: Graph Generator (skeleton only — no build prompts)
    const rawGraph = await this.aiService.generateGraph(architecture, frontend);
    const graph = GraphSchema.parse(rawGraph);

    // Step 5: Explanation Engine
    const rawExplanation = await this.aiService.generateExplanation(
      architecture,
      requirements,
      frontend,
    );
    const explanation = ExplanationSchema.parse(rawExplanation);

    // Step 6: Implementation Guide
    let implementation: ImplementationGuide | undefined;
    try {
      const rawImplementation = await this.aiService.generateImplementationGuide(
        architecture,
        requirements,
        explanation,
      );
      implementation = ImplementationGuideSchema.parse(rawImplementation);
    } catch (error) {
      console.warn('Failed to generate implementation guide:', error);
    }

    return {
      requirements,
      architecture,
      frontend,
      graph,
      explanation,
      implementation,
    };
  }
}

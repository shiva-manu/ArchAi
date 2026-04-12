import { describe, it, expect } from 'vitest';
import {
  GenerateArchitectureRequestSchema,
  RequirementSchema,
  GraphSchema,
  ArchitectureDecisionSchema,
  FrontendArchitectureSchema,
  ExplanationSchema,
  ImplementationGuideSchema,
} from '../schemas/architecture.schema';

describe('GenerateArchitectureRequestSchema', () => {
  it('accepts valid input with all fields', () => {
    const result = GenerateArchitectureRequestSchema.parse({
      idea: 'I want to build a real-time collaborative code editor with video chat',
      scale: '10k',
      constraints: ['Must use PostgreSQL', 'Budget under $200/mo'],
    });

    expect(result.idea).toBe('I want to build a real-time collaborative code editor with video chat');
    expect(result.scale).toBe('10k');
    expect(result.constraints).toHaveLength(2);
  });

  it('accepts minimal input without constraints', () => {
    const result = GenerateArchitectureRequestSchema.parse({
      idea: 'A simple todo API with user authentication',
      scale: '1k',
    });

    expect(result.constraints).toEqual([]);
  });

  it('rejects idea shorter than 10 characters', () => {
    expect(() =>
      GenerateArchitectureRequestSchema.parse({
        idea: 'Too short',
        scale: '1k',
      })
    ).toThrow();
  });

  it('rejects idea longer than 5000 characters', () => {
    expect(() =>
      GenerateArchitectureRequestSchema.parse({
        idea: 'a'.repeat(5001),
        scale: '1k',
      })
    ).toThrow();
  });

  it('rejects invalid scale values', () => {
    expect(() =>
      GenerateArchitectureRequestSchema.parse({
        idea: 'A valid idea that is long enough',
        scale: '50k',
      })
    ).toThrow();
  });

  it('rejects more than 10 constraints', () => {
    expect(() =>
      GenerateArchitectureRequestSchema.parse({
        idea: 'A valid idea',
        scale: '1k',
        constraints: Array(11).fill('constraint'),
      })
    ).toThrow();
  });

  it('unwraps single-element array input (Groq SDK quirk)', () => {
    const result = GenerateArchitectureRequestSchema.parse([
      { idea: 'A valid idea here', scale: '1k' },
    ]);

    expect(result.idea).toBe('A valid idea here');
  });
});

describe('ArchitectureDecisionSchema', () => {
  it('accepts valid monolith architecture', () => {
    const result = ArchitectureDecisionSchema.parse({
      architectureType: 'monolith',
      services: [{ name: 'API Server', description: 'Main application', tech: ['Node.js', 'Express'] }],
      database: { type: 'SQL', reason: 'Relational data with complex queries' },
      cache: { type: 'Redis', reason: 'Session caching and rate limiting' },
      queue: { type: 'None', reason: 'No async processing needed' },
    });

    expect(result.architectureType).toBe('monolith');
    expect(result.services).toHaveLength(1);
  });

  it('accepts valid microservices architecture', () => {
    const result = ArchitectureDecisionSchema.parse({
      architectureType: 'microservices',
      services: [
        { name: 'Auth Service', description: 'Handles authentication', tech: ['Node.js'] },
        { name: 'User Service', description: 'User management', tech: ['Python'] },
      ],
      database: { type: 'NoSQL', reason: 'Flexible schema for user profiles' },
      cache: { type: 'Redis', reason: 'Caching user sessions' },
      queue: { type: 'RabbitMQ', reason: 'Async email notifications' },
    });

    expect(result.architectureType).toBe('microservices');
    expect(result.services).toHaveLength(2);
  });

  it('rejects invalid architecture type', () => {
    expect(() =>
      ArchitectureDecisionSchema.parse({
        architectureType: 'serverless',
        services: [],
        database: { type: 'SQL', reason: 'test' },
        cache: { type: 'Redis', reason: 'test' },
        queue: { type: 'None', reason: 'test' },
      })
    ).toThrow();
  });

  it('rejects invalid database type', () => {
    expect(() =>
      ArchitectureDecisionSchema.parse({
        architectureType: 'monolith',
        services: [],
        database: { type: 'GraphDB', reason: 'test' },
        cache: { type: 'Redis', reason: 'test' },
        queue: { type: 'None', reason: 'test' },
      })
    ).toThrow();
  });
});

describe('GraphSchema', () => {
  it('accepts valid graph with nodes and edges', () => {
    const result = GraphSchema.parse({
      nodes: [
        {
          id: 'client',
          type: 'frontend',
          position: { x: 300, y: -150 },
          data: { label: 'Web App', description: 'React frontend' },
        },
        {
          id: 'api',
          type: 'service',
          position: { x: 300, y: 80 },
          data: { label: 'API Server', description: 'Express backend' },
        },
      ],
      edges: [
        {
          id: 'e_client_api',
          source: 'client',
          target: 'api',
          label: 'HTTPS',
          labelType: 'sync',
          stepNumber: 1,
          style: 'solid',
        },
      ],
    });

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].labelType).toBe('sync');
  });

  it('rejects invalid node type', () => {
    expect(() =>
      GraphSchema.parse({
        nodes: [{
          id: 'invalid',
          type: 'lambda',
          position: { x: 0, y: 0 },
          data: { label: 'Invalid' },
        }],
        edges: [],
      })
    ).toThrow();
  });

  it('rejects invalid edge label type', () => {
    expect(() =>
      GraphSchema.parse({
        nodes: [{
          id: 'a',
          type: 'service',
          position: { x: 0, y: 0 },
          data: { label: 'A' },
        }],
        edges: [{
          id: 'e',
          source: 'a',
          target: 'a',
          labelType: 'broadcast',
        }],
      })
    ).toThrow();
  });

  it('accepts nullable fields in graph data', () => {
    const result = GraphSchema.parse({
      nodes: [{
        id: 'a',
        type: 'service',
        position: { x: 0, y: 0 },
        data: {
          label: 'A',
          description: null,
          actions: null,
          stepNumber: null,
          group: null,
          buildPrompt: null,
        },
      }],
      edges: [{
        id: 'e',
        source: 'a',
        target: 'a',
        label: null,
        labelType: null,
        stepNumber: null,
        style: null,
      }],
    });

    expect(result.nodes[0].data.description).toBeNull();
  });
});

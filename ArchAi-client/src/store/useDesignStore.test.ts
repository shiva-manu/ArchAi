import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDesignStore } from './useDesignStore';

const mockResponse = {
  requirements: {
    entities: ['User', 'Project'],
    features: ['auth', 'CRUD'],
    users: 'Developers',
    constraints: [],
  },
  architecture: {
    architectureType: 'monolith',
    services: [{ name: 'API', description: 'Main server', tech: ['Node.js'] }],
    database: { type: 'SQL', reason: 'Relational data' },
    cache: { type: 'Redis', reason: 'Caching' },
    queue: { type: 'None', reason: 'Not needed' },
  },
  frontend: {
    framework: 'React',
    styling: 'Tailwind',
    stateManagement: 'Zustand',
    pages: [{ name: 'Dashboard', path: '/dashboard', description: 'Main view', components: [], features: [] }],
    components: [],
    layout: 'sidebar',
    routing: 'React Router',
  },
  graph: {
    nodes: [
      { id: 'client', type: 'frontend', position: { x: 300, y: -150 }, data: { label: 'Web App' } },
      { id: 'api', type: 'service', position: { x: 300, y: 80 }, data: { label: 'API' } },
    ],
    edges: [
      { id: 'e_client_api', source: 'client', target: 'api', label: 'HTTPS', labelType: 'sync', stepNumber: 1, style: 'solid' },
    ],
  },
  explanation: {
    architectureExplanation: 'A monolith for simplicity',
    apiDesign: [
      { route: '/api/users', method: 'GET', description: 'List users' },
    ],
    scalingStrategy: 'Vertical scaling',
    tradeOffs: ['Monolith may not scale well'],
  },
  implementation: {
    projectStructure: 'src/\n  server/\n  client/',
    developmentSteps: [{ phase: 'Phase 1', title: 'Setup', description: 'Initialize project', tasks: ['Install deps'], estimatedDays: 1 }],
    technologyStack: { frontend: [], backend: [], database: [], infrastructure: [], monitoring: [] },
    deploymentGuide: { steps: ['Deploy to cloud'], platforms: ['AWS'], environmentVariables: [] },
    costEstimate: { monthly: 50, breakdown: [{ service: 'EC2', cost: 50, description: 'Server' }], assumptions: 'Low traffic' },
    bestPractices: ['Use HTTPS'],
  },
};

describe('useDesignStore', () => {
  beforeEach(() => {
    const store = useDesignStore.getState();
    store.reset();

    global.fetch = vi.fn(async (url: string) => {
      if (url.includes('generate-architecture')) {
        return {
          ok: true,
          json: async () => mockResponse,
        } as Response;
      }
      if (url.includes('generate-build-prompts')) {
        return {
          ok: true,
          body: null,
        } as Response;
      }
      return { ok: false, status: 404 } as Response;
    });
  });

  it('has correct initial state', () => {
    const store = useDesignStore.getState();
    expect(store.input.idea).toBe('');
    expect(store.input.scale).toBe('1k');
    expect(store.isLoading).toBe(false);
    expect(store.isGenerated).toBe(false);
    expect(store.design).toBeNull();
    expect(store.error).toBeNull();
  });

  it('updates input via setInput', () => {
    useDesignStore.getState().reset();
    useDesignStore.getState().setInput({ idea: 'Test idea', scale: '100k' });
    const store = useDesignStore.getState();
    expect(store.input.idea).toBe('Test idea');
    expect(store.input.scale).toBe('100k');
  });

  it('merges partial input updates', () => {
    useDesignStore.getState().setInput({ idea: 'New idea', scale: '1k' });
    const store = useDesignStore.getState();
    expect(store.input.idea).toBe('New idea');
    expect(store.input.scale).toBe('1k');
  });

  it('resets generation state but preserves input', () => {
    useDesignStore.getState().setInput({ idea: 'Something' });
    useDesignStore.getState().setActiveTab('api');
    useDesignStore.getState().reset();

    const store = useDesignStore.getState();
    expect(store.input.idea).toBe('Something'); // reset() doesn't clear input
    expect(store.activeTab).toBe('architecture');
    expect(store.design).toBeNull();
    expect(store.error).toBeNull();
  });

  it('sets active tab', () => {
    useDesignStore.getState().setActiveTab('frontend');
    expect(useDesignStore.getState().activeTab).toBe('frontend');

    useDesignStore.getState().setActiveTab('scaling');
    expect(useDesignStore.getState().activeTab).toBe('scaling');
  });

  it('generates design and updates store on success', async () => {
    useDesignStore.getState().setInput({ idea: 'Build a real-time chat app with user auth' });

    await useDesignStore.getState().generateDesign();

    const store = useDesignStore.getState();
    expect(store.isLoading).toBe(false);
    expect(store.isGenerated).toBe(true);
    expect(store.design).not.toBeNull();
    expect(store.design?.requirements.entities).toContain('User');
    expect(store.design?.graph.nodes).toHaveLength(2);
    expect(store.error).toBeNull();
  });

  it('captures API error on failed generation', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'AI provider failed' }),
    } as Response);

    useDesignStore.getState().setInput({ idea: 'Some idea here' });
    await useDesignStore.getState().generateDesign();

    const store = useDesignStore.getState();
    expect(store.isLoading).toBe(false);
    expect(store.error).not.toBeNull();
    expect(store.design).toBeNull();
  });
});

import { create } from 'zustand'
import type { DesignInput, SystemDesign, ArchitectureResponse } from '@/types'
import { generateArchitecture, streamBuildPrompts } from '@/services/api'
import { logger } from '@/utils/logger'

interface DesignState {
  input: DesignInput
  isLoading: boolean
  isGenerated: boolean
  activeTab: 'architecture' | 'frontend' | 'api' | 'scaling'
  design: SystemDesign | null
  error: string | null
  /** Set of node IDs that are currently waiting for their build prompt */
  loadingNodes: Set<string>
  setInput: (input: Partial<DesignInput>) => void
  generateDesign: () => Promise<void>
  setActiveTab: (tab: 'architecture' | 'frontend' | 'api' | 'scaling') => void
  reset: () => void
}

function transformBackendResponse(response: ArchitectureResponse): SystemDesign {
  return {
    requirements: response.requirements,
    architecture: response.architecture,
    graph: response.graph,
    explanation: {
      ...response.explanation,
      apiDesign: response.explanation.apiDesign.map((endpoint) => ({
        ...endpoint,
        method: endpoint.method as import('@/types').HttpMethod,
      })),
    },
    implementation: response.implementation,
  }
}

export const useDesignStore = create<DesignState>((set) => ({
  input: {
    idea: '',
    scale: '1k',
  },
  isLoading: false,
  isGenerated: false,
  activeTab: 'architecture',
  design: null,
  error: null,
  loadingNodes: new Set(),

  setInput: (input) =>
    set((state) => ({
      input: { ...state.input, ...input },
    })),

  generateDesign: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await generateArchitecture({
        idea: useDesignStore.getState().input.idea,
        scale: useDesignStore.getState().input.scale as '1k' | '10k' | '100k' | '1M',
      })

      const design = transformBackendResponse(response)

      // Mark all nodes as loading for their prompts
      const loadingNodes = new Set(design.graph.nodes.map((n) => n.id))
      set({
        isLoading: false,
        isGenerated: true,
        design,
        loadingNodes,
        error: null,
      })

      // Stream build prompts sequentially
      await streamBuildPrompts(
        design.graph,
        design.architecture,
        design.frontend,
        (nodeId, prompt) => {
          set((state) => {
            if (!state.design) return state
            const newNodes = state.design.graph.nodes.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, buildPrompt: prompt } } : n
            )
            const newLoading = new Set(state.loadingNodes)
            newLoading.delete(nodeId)
            return {
              design: { ...state.design, graph: { ...state.design.graph, nodes: newNodes } },
              loadingNodes: newLoading,
            }
          })
        },
        () => {
          set({ loadingNodes: new Set() })
        },
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate architecture'
      logger.error('Design generation failed', { message })
      set({
        isLoading: false,
        error: message,
      })
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  reset: () =>
    set({
      isGenerated: false,
      design: null,
      activeTab: 'architecture',
      error: null,
      loadingNodes: new Set(),
    }),
}))

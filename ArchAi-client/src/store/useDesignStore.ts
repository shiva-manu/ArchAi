import { create } from 'zustand'
import type { DesignInput, SystemDesign, ArchitectureResponse, UserScale } from '@/types'
import { generateArchitecture, streamBuildPrompts } from '@/services/api'
import { logger } from '@/utils/logger'
import { saveDesign, loadDesign, listDesigns, deleteDesign, type DesignRecord } from '@/utils/storage'

interface DesignState {
  input: DesignInput
  isLoading: boolean
  isGenerated: boolean
  activeTab: 'architecture' | 'frontend' | 'api' | 'scaling'
  design: SystemDesign | null
  designId: string | null
  error: string | null
  /** Set of node IDs that are currently waiting for their build prompt */
  loadingNodes: Set<string>
  /** History of saved designs */
  savedDesigns: DesignRecord[]
  setInput: (input: Partial<DesignInput>) => void
  generateDesign: () => Promise<void>
  setActiveTab: (tab: 'architecture' | 'frontend' | 'api' | 'scaling') => void
  reset: () => void
  /** Save current design to localStorage */
  saveCurrentDesign: () => string | null
  /** Load a saved design by ID */
  loadDesign: (id: string) => boolean
  /** Delete a saved design */
  deleteDesign: (id: string) => void
  /** Refresh the saved designs list */
  refreshSavedDesigns: () => void
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

// Debounced auto-save
let saveTimeout: ReturnType<typeof setTimeout> | null = null
function debouncedSave(state: DesignState) {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    if (state.isGenerated && state.design) {
      const id = saveDesign(state.design, state.input.idea, state.input.scale, state.designId ?? undefined)
      // Update designId if it was newly generated
      if (!state.designId) {
        useDesignStore.setState({ designId: id })
      }
    }
  }, 1000)
}

// Restore from URL param on init
function getInitialDesignFromUrl(): { designId: string | null; idea: string; scale: UserScale } {
  const params = new URLSearchParams(window.location.search)
  const designId = params.get('design')
  const idea = params.get('idea') || ''
  const validScales: UserScale[] = ['1k', '10k', '100k', '1M']
  const scale = validScales.includes(params.get('scale') as UserScale)
    ? (params.get('scale') as UserScale)
    : '1k'

  // If design ID in URL, try to load it
  if (designId) {
    const saved = loadDesign(designId)
    if (saved) {
      logger.info('Restored design from URL', { designId })
      const validScales: UserScale[] = ['1k', '10k', '100k', '1M']
      const restoredScale = validScales.includes(saved.scale as UserScale)
        ? (saved.scale as UserScale)
        : scale
      return { designId, idea: saved.idea || idea, scale: restoredScale }
    }
    logger.warn('Design not found in URL', { designId })
  }

  return { designId, idea, scale }
}

const urlState = getInitialDesignFromUrl()

export const useDesignStore = create<DesignState>((set, get) => ({
  input: {
    idea: urlState.idea,
    scale: urlState.scale,
  },
  isLoading: false,
  isGenerated: false,
  activeTab: 'architecture',
  design: null,
  designId: urlState.designId,
  error: null,
  loadingNodes: new Set(),
  savedDesigns: listDesigns(),

  setInput: (input) =>
    set((state) => {
      const newState = { input: { ...state.input, ...input } }
      debouncedSave({ ...state, ...newState })
      return newState
    }),

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

      // Save immediately after generation
      const id = saveDesign(design, get().input.idea, get().input.scale)

      set({
        isLoading: false,
        isGenerated: true,
        design,
        designId: id,
        loadingNodes,
        error: null,
        savedDesigns: listDesigns(),
      })

      // Update URL with shareable link
      const url = new URL(window.location.href)
      url.searchParams.set('design', id)
      window.history.replaceState({}, '', url.toString())

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
      designId: null,
      activeTab: 'architecture',
      error: null,
      loadingNodes: new Set(),
    }),

  saveCurrentDesign: () => {
    const state = get()
    if (!state.isGenerated || !state.design) return null
    const id = saveDesign(state.design, state.input.idea, state.input.scale, state.designId ?? undefined)
    set({ designId: id, savedDesigns: listDesigns() })
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('design', id)
    window.history.replaceState({}, '', url.toString())
    return id
  },

  loadDesign: (id) => {
    const saved = loadDesign(id)
    if (!saved) {
      logger.warn('Failed to load design', { id })
      return false
    }
    const validScales: UserScale[] = ['1k', '10k', '100k', '1M']
    const scale = validScales.includes(saved.scale as UserScale) ? (saved.scale as UserScale) : '1k'
    set({
      design: saved.design,
      input: { idea: saved.idea, scale },
      designId: id,
      isGenerated: true,
      loadingNodes: new Set(),
      error: null,
    })
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('design', id)
    window.history.replaceState({}, '', url.toString())
    return true
  },

  deleteDesign: (id) => {
    deleteDesign(id)
    set({ savedDesigns: listDesigns() })
    // If deleting current design, reset
    if (get().designId === id) {
      get().reset()
    }
  },

  refreshSavedDesigns: () => {
    set({ savedDesigns: listDesigns() })
  },
}))

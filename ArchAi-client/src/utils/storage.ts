/**
 * localStorage persistence for design state.
 * Handles save, load, list, delete with versioned keys.
 */

import type { SystemDesign } from '@/types'
import { logger } from './logger'

const STORAGE_VERSION = 'v1'
const DESIGN_KEY = (id: string) => `archai-design-${STORAGE_VERSION}-${id}`
const INDEX_KEY = `archai-design-index-${STORAGE_VERSION}`

export interface DesignRecord {
  id: string
  title: string
  idea: string
  createdAt: string
  updatedAt: string
  scale: string
}

/** Generate a short ID (8 chars, base62) */
function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function getIndex(): DesignRecord[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    logger.warn('Failed to parse design index')
    return []
  }
}

function setIndex(index: DesignRecord[]) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index))
  } catch (err) {
    logger.error('Failed to save design index', { error: err instanceof Error ? err.message : 'Unknown' })
  }
}

export function saveDesign(
  design: SystemDesign,
  idea: string,
  scale: string,
  existingId?: string
): string {
  const id = existingId || generateId()
  const now = new Date().toISOString()

  // Save the full design
  try {
    localStorage.setItem(
      DESIGN_KEY(id),
      JSON.stringify({ design, idea, scale, savedAt: now })
    )
  } catch (err) {
    // Handle quota exceeded
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      logger.error('localStorage quota exceeded — deleting oldest design')
      // Delete oldest design and retry
      const index = getIndex()
      if (index.length > 0) {
        const oldest = index[index.length - 1]
        deleteDesign(oldest.id)
        return saveDesign(design, idea, scale, existingId)
      }
    }
    throw err
  }

  // Update index
  const index = getIndex()
  const title = design.requirements.features.slice(0, 3).join(', ') || 'Untitled design'
  const record: DesignRecord = {
    id,
    title,
    idea: idea.slice(0, 100),
    createdAt: now,
    updatedAt: now,
    scale,
  }

  // Update existing or prepend new
  const existingIndex = index.findIndex(r => r.id === id)
  if (existingIndex >= 0) {
    index[existingIndex] = { ...record, createdAt: index[existingIndex].createdAt }
  } else {
    index.unshift(record)
  }

  // Keep max 20 designs
  if (index.length > 20) {
    const removed = index.splice(20)
    removed.forEach(r => deleteDesign(r.id))
  }

  setIndex(index)
  return id
}

export function loadDesign(id: string): { design: SystemDesign; idea: string; scale: string } | null {
  try {
    const raw = localStorage.getItem(DESIGN_KEY(id))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    logger.warn('Failed to load design', { id })
    return null
  }
}

export function listDesigns(): DesignRecord[] {
  return getIndex()
}

export function deleteDesign(id: string) {
  try {
    localStorage.removeItem(DESIGN_KEY(id))
  } catch {
    // Ignore
  }

  const index = getIndex().filter(r => r.id !== id)
  setIndex(index)
}

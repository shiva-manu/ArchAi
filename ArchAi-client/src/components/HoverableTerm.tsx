import { HoverTooltip } from '@/components/HoverTooltip'
import { architecturePrompts, type PromptKey } from '@/utils/architecture-prompts'
import type { ReactNode } from 'react'

interface HoverableTermProps {
  promptKey: PromptKey
  children: ReactNode
}

/**
 * A reusable component that wraps text/terms with hover tooltips showing AI prompts.
 * Usage: <HoverableTerm promptKey="frontend">Frontend</HoverableTerm>
 */
export function HoverableTerm({ promptKey, children }: HoverableTermProps) {
  const promptData = architecturePrompts[promptKey]

  return (
    <HoverTooltip
      trigger={children}
      title={promptData.title}
      prompt={promptData.prompt}
    />
  )
}

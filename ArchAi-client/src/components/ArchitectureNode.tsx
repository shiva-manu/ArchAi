import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Monitor,
  Server,
  Database,
  Zap,
  ListOrdered,
  Network,
  HardDrive,
  Cloud,
  Settings,
  ExternalLink,
  Bell,
  Code2,
  X,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NodeData, NodeType } from '@/types'

const iconMap: Record<NodeType, React.ComponentType<{ className?: string }>> = {
  frontend: Monitor,
  backend: Server,
  database: Database,
  cache: Zap,
  queue: ListOrdered,
  gateway: Network,
  storage: HardDrive,
  cdn: Cloud,
  service: Settings,
  external: ExternalLink,
  notification: Bell,
}

// Dark theme colors per node type matching the ByteByteGo reference
const nodeStyles: Record<NodeType, {
  bg: string
  border: string
  icon: string
  label: string
  desc: string
  stepBg: string
  stepText: string
}> = {
  frontend: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-blue-500/50',
    icon: 'text-blue-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-blue-500',
    stepText: 'text-white',
  },
  backend: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-emerald-500/50',
    icon: 'text-emerald-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-emerald-500',
    stepText: 'text-white',
  },
  database: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-purple-500/50',
    icon: 'text-purple-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-purple-500',
    stepText: 'text-white',
  },
  cache: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-amber-500/50',
    icon: 'text-amber-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-amber-500',
    stepText: 'text-white',
  },
  queue: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-cyan-500/50',
    icon: 'text-cyan-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-cyan-500',
    stepText: 'text-white',
  },
  gateway: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-pink-500/50',
    icon: 'text-pink-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-pink-500',
    stepText: 'text-white',
  },
  storage: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-sky-500/50',
    icon: 'text-sky-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-sky-500',
    stepText: 'text-white',
  },
  cdn: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-teal-500/50',
    icon: 'text-teal-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-teal-500',
    stepText: 'text-white',
  },
  service: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-orange-500/50',
    icon: 'text-orange-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-orange-500',
    stepText: 'text-white',
  },
  external: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-zinc-500/50',
    icon: 'text-zinc-400',
    label: 'text-zinc-200',
    desc: 'text-zinc-500',
    stepBg: 'bg-zinc-500',
    stepText: 'text-white',
  },
  notification: {
    bg: 'bg-[#1a1a2e]',
    border: 'border-rose-500/50',
    icon: 'text-rose-400',
    label: 'text-zinc-100',
    desc: 'text-zinc-400',
    stepBg: 'bg-rose-500',
    stepText: 'text-white',
  },
}

function BuildPromptOverlay({
  prompt,
  label,
  onClose,
}: {
  prompt: string
  label: string
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 left-full ml-4 top-0 w-[420px]"
    >
      <div className="rounded-lg border border-zinc-700/60 bg-[#12121a]/95 backdrop-blur-md shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-700/40 bg-zinc-800/30">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-zinc-100">Build Prompt</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Label */}
        <div className="px-4 py-2 bg-zinc-800/20">
          <span className="text-xs font-mono text-zinc-200 font-medium">{label}</span>
        </div>
        {/* Prompt */}
        <div className="px-4 py-3 max-h-72 overflow-y-auto">
          <pre className="text-xs leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap break-words">
            {prompt}
          </pre>
        </div>
        {/* Arrow */}
        <div className="absolute right-full top-4">
          <div className="w-2.5 h-2.5 bg-[#12121a]/95 border-r border-b border-zinc-700/60 rotate-45 -mr-1.5" />
        </div>
      </div>
    </motion.div>
  )
}

export const ArchitectureNodeComponent = memo(({ data, selected }: { data: NodeData; selected?: boolean }) => {
  const Icon = iconMap[data.nodeType] || Settings
  const style = nodeStyles[data.nodeType] || nodeStyles.service
  const [showPrompt, setShowPrompt] = useState(false)
  const actions = data.actions || []
  const hasPrompt = !!data.buildPrompt
  const isLoading = !hasPrompt // If no prompt yet, we're loading

  return (
    <div className="relative">
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !bg-zinc-400 !border !border-zinc-600"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !bg-zinc-400 !border !border-zinc-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !bg-zinc-400 !border !border-zinc-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !bg-zinc-400 !border !border-zinc-600"
      />

      {/* Build Prompt Overlay */}
      <AnimatePresence>
        {showPrompt && data.buildPrompt && (
          <BuildPromptOverlay
            prompt={data.buildPrompt}
            label={data.label}
            onClose={() => setShowPrompt(false)}
          />
        )}
      </AnimatePresence>

      {/* Node body — dark themed like the reference */}
      <div
        role={hasPrompt ? 'button' : undefined}
        tabIndex={hasPrompt ? 0 : undefined}
        onKeyDown={hasPrompt ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowPrompt((v) => !v) } } : undefined}
        className={cn(
          'relative rounded-xl border-2 min-w-[140px] max-w-[180px] overflow-visible transition-all duration-200',
          style.border,
          style.bg,
          'hover:brightness-110 hover:shadow-lg',
          isLoading && 'opacity-80',
          selected && 'ring-2 ring-cyan-400/50',
          hasPrompt && 'cursor-pointer'
        )}
        onClick={() => hasPrompt && setShowPrompt((v) => !v)}
        aria-label={hasPrompt ? `Show build prompt for ${data.label}` : undefined}
        aria-expanded={hasPrompt ? showPrompt : undefined}
        title={hasPrompt ? 'Click to see build prompt' : isLoading ? 'Generating prompt...' : undefined}
      >
        {/* Step number callout circle (top-left, outside the node) */}
        {data.stepNumber && (
          <div className={cn(
            'absolute -top-3 -left-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold z-10 shadow-lg',
            style.stepBg,
            style.stepText
          )}>
            {data.stepNumber}
          </div>
        )}

        {/* Icon + Label row */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className={cn('shrink-0', style.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-bold leading-tight truncate', style.label)}>
              {data.label}
            </p>
            {data.description && (
              <p className={cn('text-xs leading-tight mt-0.5 truncate', style.desc)}>
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Action badges */}
        {actions.length > 0 && (
          <div className="px-3 pb-2.5">
            <div className="flex flex-wrap gap-1">
              {actions.slice(0, 2).map((action, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded bg-zinc-700/60 px-1.5 py-0.5 text-xs font-medium text-zinc-300"
                >
                  {action}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Loading spinner or click indicator */}
        {isLoading ? (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap">
            <Loader2 className="h-3 w-3 text-cyan-400/60 animate-spin" />
            <span className="text-xs font-mono text-cyan-400/50 uppercase tracking-wider">
              generating...
            </span>
          </div>
        ) : (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap">
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
              click for prompt
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

ArchitectureNodeComponent.displayName = 'ArchitectureNode'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HoverTooltipProps {
  trigger: ReactNode
  title: string
  prompt: string
}

export function HoverTooltip({ trigger, title, prompt }: HoverTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        className={cn(
          'cursor-help border-b border-dashed border-slate-faint/30 transition-colors',
          'hover:border-cyan-500/40 hover:text-zinc-100'
        )}
      >
        {trigger}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2"
            style={{ minWidth: '320px', maxWidth: '480px' }}
          >
            <div className="rounded-lg border border-slate-border/60 bg-obsidian-elevated shadow-2xl shadow-black/60 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-border/40 bg-obsidian-soft/50">
                <Code2 className="h-3.5 w-3.5 text-cyan-400/70" />
                <span className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wide">{title}</span>
              </div>

              {/* Prompt Content */}
              <div className="px-3 py-2.5 max-h-64 overflow-y-auto">
                <pre className="text-xs leading-relaxed text-slate-muted/70 font-mono whitespace-pre-wrap break-words">
                  {prompt}
                </pre>
              </div>

              {/* Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full">
                <div className="w-2.5 h-2.5 bg-obsidian-elevated border-r border-b border-slate-border/60 rotate-45 -mt-1.5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

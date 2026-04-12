import { Sparkles, Loader2, AlertCircle, ChevronDown, Terminal, History, Trash2, Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDesignStore } from '@/store/useDesignStore'
import type { UserScale } from '@/types'
import { useState, useEffect } from 'react'

const scales: { value: UserScale; label: string }[] = [
  { value: '1k', label: '1K concurrent' },
  { value: '10k', label: '10K concurrent' },
  { value: '100k', label: '100K concurrent' },
  { value: '1M', label: '1M concurrent' },
]

export function InputPanel() {
  const { input, setInput, generateDesign, isLoading, error, savedDesigns, loadDesign, deleteDesign, designId } = useDesignStore()
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState(false)

  // Refresh history on mount
  useEffect(() => {
    useDesignStore.getState().refreshSavedDesigns()
  }, [])

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-cyan-500/70" />
          <h2 className="font-mono text-xs font-semibold text-zinc-100 tracking-wide">
            SYSTEM INPUT
          </h2>
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          Describe your architecture requirements
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 overflow-y-auto">
        {/* Prompt Indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-cyan-500/80">$</span>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            describe your system
          </span>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            placeholder="I want to build a real-time collaborative code editor with video chat, shared terminals, and project deployment capabilities..."
            value={input.idea}
            onChange={(e) => setInput({ idea: e.target.value })}
            rows={8}
            className={cn(
              'w-full resize-none rounded-md border bg-obsidian px-3 py-2.5 text-sm leading-relaxed outline-none transition-all',
              'font-body text-zinc-200 placeholder:text-zinc-500',
              'border-slate-border/60 focus:border-cyan-500/40 focus:shadow-[0_0_0_1px_rgba(6,182,212,0.15)]'
            )}
          />
          {/* Corner character count */}
          {input.idea.trim() && (
            <span className="absolute bottom-2 right-2 font-mono text-xs text-zinc-500">
              {input.idea.length} chars
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-rose-500/20 bg-rose-500/5 p-2.5">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 text-rose-400 shrink-0" />
            <p className="text-xs text-rose-400/90 font-body">{error}</p>
          </div>
        )}

        {/* Scale Selector */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
              Target Scale
            </span>
            <span className="font-mono text-xs text-zinc-600">→</span>
          </div>
          <div className="relative">
            <select
              value={input.scale}
              onChange={(e) => setInput({ scale: e.target.value as UserScale })}
              className={cn(
                'w-full appearance-none rounded-md border bg-obsidian px-3 py-2 text-sm outline-none transition-all cursor-pointer',
                'font-mono text-zinc-200',
                'border-slate-border/60 focus:border-cyan-500/40'
              )}
            >
              {scales.map((scale) => (
                <option key={scale.value} value={scale.value}>
                  {scale.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Constraints hint */}
        <div className="mt-4 rounded-md border border-slate-border/30 bg-obsidian-soft/50 px-3 py-2.5">
          <p className="font-mono text-xs text-zinc-400 leading-relaxed">
            <span className="text-cyan-500/70">tip:</span> Include tech stack preferences, compliance needs, or budget constraints
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* History + Share row */}
        {designId && (
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-slate-border/30 bg-obsidian-soft/50 px-2 py-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-200 hover:border-slate-border/50"
              title="Copy share link"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Share2 className="h-3 w-3" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-slate-border/30 bg-obsidian-soft/50 px-2 py-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-200 hover:border-slate-border/50"
              title="Past designs"
            >
              <History className="h-3 w-3" />
              History ({savedDesigns.length})
            </button>
          </div>
        )}

        {/* Design History */}
        {showHistory && savedDesigns.length > 0 && (
          <div className="mb-3 max-h-40 overflow-y-auto rounded-md border border-slate-border/30 bg-obsidian-soft/50">
            {savedDesigns.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 border-b border-slate-border/20 px-3 py-2 last:border-b-0"
              >
                <button
                  onClick={() => { loadDesign(d.id); setShowHistory(false) }}
                  className="flex-1 text-left"
                >
                  <p className="text-xs text-zinc-300 truncate">{d.title}</p>
                  <p className="text-[10px] text-zinc-500">{new Date(d.createdAt).toLocaleDateString()}</p>
                </button>
                <button
                  onClick={() => deleteDesign(d.id)}
                  className="text-zinc-600 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-4">
          <button
            onClick={generateDesign}
            disabled={isLoading || !input.idea.trim()}
            className={cn(
              'group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-md px-4 py-2.5 text-sm font-medium transition-all',
              'font-mono',
              'border border-cyan-500/30 bg-cyan-500/5 text-cyan-300',
              'hover:bg-cyan-500/10 hover:border-cyan-500/50',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:border-slate-border/30 disabled:bg-transparent disabled:text-zinc-600 disabled:hover:border-slate-border/30'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Architecture
              </>
            )}
            {/* Hover sweep */}
            {!isLoading && input.idea.trim() && (
              <div className="absolute inset-0 -translate-x-full bg-cyan-500/5 transition-transform duration-500 group-hover:translate-x-0" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

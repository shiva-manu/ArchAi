import { Link } from 'react-router-dom'
import { ReactFlowProvider } from '@xyflow/react'
import { ArrowLeft, Terminal } from 'lucide-react'
import { InputPanel } from '@/components/InputPanel'
import { VisualizationPanel } from '@/components/VisualizationPanel'
import { DetailsPanel } from '@/components/DetailsPanel'
import { ImplementationGuidePanel } from '@/components/ImplementationGuidePanel'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useState } from 'react'

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-border/30 px-4 py-2 bg-obsidian-soft/80">
      <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors group">
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <Terminal className="h-3 w-3 text-cyan-500/70" />
        <span className="font-mono text-xs uppercase tracking-wider">Back</span>
      </Link>
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
        ArchAi Workspace
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [rightPanelTab, setRightPanelTab] = useState<'details' | 'guide'>('details')

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen overflow-hidden bg-obsidian flex flex-col">
        {/* Top Bar */}
        <DashboardHeader />

        {/* Main Workspace */}
        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Input */}
          <div className="w-[320px] shrink-0 flex flex-col border-r border-slate-border/40 bg-obsidian-soft/80">
            <ErrorBoundary name="Input Panel">
              <InputPanel />
            </ErrorBoundary>
          </div>

          {/* Center Panel - Visualization */}
          <div className="flex-1 bg-obsidian relative" style={{ minWidth: 0 }}>
            <ErrorBoundary name="Visualization">
              <VisualizationPanel />
            </ErrorBoundary>
          </div>

          {/* Right Panel - Details / Implementation Guide */}
          <div className="w-[440px] shrink-0 flex flex-col border-l border-slate-border/40 bg-obsidian-soft/80">
            <div className="flex border-b border-slate-border/30">
              <button
                onClick={() => setRightPanelTab('details')}
                className={`flex-1 font-mono text-xs font-medium px-4 py-2.5 transition-colors uppercase tracking-wide ${
                  rightPanelTab === 'details'
                    ? 'bg-obsidian-surface text-zinc-100 border-b border-cyan-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setRightPanelTab('guide')}
                className={`flex-1 font-mono text-xs font-medium px-4 py-2.5 transition-colors uppercase tracking-wide ${
                  rightPanelTab === 'guide'
                    ? 'bg-obsidian-surface text-zinc-100 border-b border-cyan-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Guide
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-3">
              <ErrorBoundary name={rightPanelTab === 'details' ? 'Details Panel' : 'Implementation Guide'}>
                {rightPanelTab === 'details' ? <DetailsPanel /> : <ImplementationGuidePanel />}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

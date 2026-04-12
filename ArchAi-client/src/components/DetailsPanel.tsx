import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Code, TrendingUp, Check, Layout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDesignStore } from '@/store/useDesignStore'
import { HoverableTerm } from '@/components/HoverableTerm'

type TabId = 'architecture' | 'frontend' | 'api' | 'scaling'

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: 'architecture', label: 'Architecture', icon: BookOpen, color: 'text-blueprint-glow' },
  { id: 'frontend', label: 'Frontend', icon: Layout, color: 'text-cyan-400' },
  { id: 'api', label: 'API Design', icon: Code, color: 'text-amber-400' },
  { id: 'scaling', label: 'Scaling', icon: TrendingUp, color: 'text-emerald-400' },
]

function DataCard({
  label,
  value,
  className,
}: {
  label: React.ReactNode
  value: string
  className?: string
}) {
  return (
    <div className={cn('rounded-md border border-slate-border/40 bg-obsidian/60 px-3 py-2.5', className)}>
      <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">{label}</p>
      <p className="font-body text-xs text-zinc-200 mt-1 leading-relaxed">{value}</p>
    </div>
  )
}

function Badge({ children, color = 'zinc' }: { children: React.ReactNode; color?: 'zinc' | 'blue' | 'green' | 'amber' | 'cyan' | 'violet' }) {
  const colors = {
    zinc: 'bg-zinc-800/50 text-zinc-400 border-zinc-700/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  }
  return (
    <span className={cn('inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium', colors[color])}>
      {children}
    </span>
  )
}

export function DetailsPanel() {
  const { design, activeTab, setActiveTab } = useDesignStore()

  if (!design) {
    return (
      <div className="flex h-full flex-col">
        {/* Pill Tabs - Disabled state */}
        <div className="flex items-center gap-0.5 border-b border-slate-border/30 px-3 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                disabled
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors font-mono',
                  'text-zinc-400'
                )}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="flex flex-1 items-center justify-center text-zinc-500">
          <p className="font-mono text-xs">Awaiting generation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Pill Tabs */}
      <div className="flex items-center gap-0.5 border-b border-slate-border/30 px-3 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all font-mono',
                isActive
                  ? 'bg-obsidian-surface text-zinc-200 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              <Icon className={cn('h-3 w-3', isActive && tab.color)} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {/* ─── Architecture Tab ─── */}
            {activeTab === 'architecture' && (
              <div className="space-y-3">
                <div className="rounded-md border border-slate-border/40 bg-obsidian/60 p-3">
                  <p className="font-body text-xs leading-relaxed text-zinc-300">
                    <HoverableTerm promptKey="architecture">
                      {design.explanation.architectureExplanation}
                    </HoverableTerm>
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wide mb-2">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Services
                  </h3>
                  <div className="space-y-1.5">
                    {design.architecture.services.map((service, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 text-emerald-500/80 text-xs">◆</span>
                          <div className="flex-1">
                            <span className="font-body text-xs font-medium text-zinc-200">
                              {service.name}
                            </span>
                            {service.description && (
                              <p className="font-body text-xs text-zinc-400 mt-0.5">
                                {service.description}
                              </p>
                            )}
                            {service.tech.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {service.tech.map((t, j) => (
                                  <Badge key={j} color="blue">{t}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-2">
                    Trade-offs
                  </h3>
                  <div className="space-y-1.5">
                    {design.explanation.tradeOffs.map((tradeOff, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-md border border-amber-500/15 bg-amber-500/5 p-2.5"
                      >
                        <p className="font-body text-xs text-amber-200/80">
                          <span className="text-amber-500/70 mr-1.5">⚠</span>
                          {tradeOff}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Frontend Tab ─── */}
            {activeTab === 'frontend' && design.frontend && (
              <div className="space-y-3">
                {/* Tech Stack */}
                <div>
                  <h3 className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wide mb-2">
                    Tech Stack
                  </h3>
                  <div className="grid grid-cols-1 gap-1.5">
                    <DataCard
                      label={<HoverableTerm promptKey="frontend">Framework</HoverableTerm>}
                      value={design.frontend.framework}
                    />
                    <DataCard
                      label={<HoverableTerm promptKey="frontend">Styling</HoverableTerm>}
                      value={design.frontend.styling}
                    />
                    <DataCard
                      label={<HoverableTerm promptKey="frontend">State</HoverableTerm>}
                      value={design.frontend.stateManagement}
                    />
                  </div>
                </div>

                {/* Layout & Routing */}
                <div>
                  <h3 className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wide mb-2">
                    Architecture
                  </h3>
                  <div className="space-y-1.5">
                    <div className="rounded-md border border-slate-border/40 bg-obsidian/60 p-3">
                      <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1">
                        Layout
                      </p>
                      <p className="font-body text-xs text-zinc-200 leading-relaxed">
                        {design.frontend.layout}
                      </p>
                    </div>
                    <div className="rounded-md border border-slate-border/40 bg-obsidian/60 p-3">
                      <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1">
                        Routing
                      </p>
                      <p className="font-body text-xs text-zinc-200 leading-relaxed">
                        {design.frontend.routing}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pages */}
                <div>
                  <h3 className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wide mb-2">
                    Pages ({design.frontend.pages.length})
                  </h3>
                  <div className="space-y-1.5">
                    {design.frontend.pages.map((page, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-body text-xs font-medium text-zinc-200">
                            {page.name}
                          </span>
                          <code className="font-mono text-xs text-slate-faint/50 bg-obsidian-surface px-1.5 py-0.5 rounded">
                            {page.path}
                          </code>
                        </div>
                        <p className="font-body text-xs text-zinc-400 mt-0.5">
                          {page.description}
                        </p>
                        {page.components.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {page.components.slice(0, 3).map((comp, j) => (
                              <Badge key={j} color="cyan">{comp}</Badge>
                            ))}
                            {page.components.length > 3 && (
                              <span className="font-mono text-xs text-zinc-500">
                                +{page.components.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Components */}
                {design.frontend.components.length > 0 && (
                  <div>
                    <h3 className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wide mb-2">
                      Components ({design.frontend.components.length})
                    </h3>
                    <div className="space-y-1.5">
                      {design.frontend.components.slice(0, 8).map((component, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="rounded-md border border-slate-border/20 bg-obsidian/40 p-2.5"
                        >
                          <div className="flex items-start gap-2">
                            <Badge color="violet">{component.type}</Badge>
                            <div className="flex-1 min-w-0">
                              <span className="font-body text-xs font-medium text-zinc-200">
                                {component.name}
                              </span>
                              <p className="font-body text-xs text-zinc-400 mt-0.5 truncate">
                                {component.description}
                              </p>
                              {component.apiCalls.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {component.apiCalls.slice(0, 2).map((api, j) => (
                                    <code
                                      key={j}
                                      className="font-mono text-xs text-zinc-400 bg-obsidian-surface px-1.5 py-0.5 rounded"
                                    >
                                      {api}
                                    </code>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {design.frontend.components.length > 8 && (
                        <p className="font-mono text-xs text-zinc-500 text-center mt-1">
                          +{design.frontend.components.length - 8} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── API Design Tab ─── */}
            {activeTab === 'api' && (
              <div className="space-y-2">
                {design.explanation.apiDesign.map((endpoint, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          'rounded border px-1.5 py-0.5 font-mono text-xs font-bold tracking-wide',
                          endpoint.method === 'GET' && 'border-blue-500/30 bg-blue-500/10 text-blue-400',
                          endpoint.method === 'POST' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
                          endpoint.method === 'PUT' && 'border-amber-500/30 bg-amber-500/10 text-amber-400',
                          endpoint.method === 'PATCH' && 'border-orange-500/30 bg-orange-500/10 text-orange-400',
                          endpoint.method === 'DELETE' && 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                        )}
                      >
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-xs text-zinc-300">
                        {endpoint.route}
                      </code>
                      {endpoint.authentication && (
                        <Badge color="amber">Auth</Badge>
                      )}
                    </div>
                    <p className="mt-2 font-body text-xs text-zinc-400">{endpoint.description}</p>
                    {endpoint.requestSchema && (
                      <div className="mt-2">
                        <p className="font-mono text-xs text-zinc-400 uppercase tracking-wide mb-1">Request</p>
                        <code className="font-mono text-xs text-zinc-300 bg-obsidian-surface/60 px-2 py-1.5 rounded block leading-relaxed">
                          {endpoint.requestSchema}
                        </code>
                      </div>
                    )}
                    {endpoint.responseSchema && (
                      <div className="mt-2">
                        <p className="font-mono text-xs text-zinc-400 uppercase tracking-wide mb-1">Response</p>
                        <code className="font-mono text-xs text-zinc-300 bg-obsidian-surface/60 px-2 py-1.5 rounded block leading-relaxed">
                          {endpoint.responseSchema}
                        </code>
                      </div>
                    )}
                    {endpoint.rateLimit && (
                      <p className="mt-2 font-mono text-xs text-zinc-400">
                        Rate: {endpoint.rateLimit}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* ─── Scaling Tab ─── */}
            {activeTab === 'scaling' && (
              <div className="space-y-3">
                <div className="rounded-md border border-slate-border/40 bg-obsidian/60 p-3">
                  <p className="font-body text-xs leading-relaxed text-zinc-300">
                    <HoverableTerm promptKey="scaling">
                      {design.explanation.scalingStrategy}
                    </HoverableTerm>
                  </p>
                </div>

                <div>
                  <h3 className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wide mb-2">
                    <HoverableTerm promptKey="architecture">Infrastructure</HoverableTerm>
                  </h3>
                  <div className="space-y-1.5">
                    <DataCard
                      label={<HoverableTerm promptKey="architecture">Database</HoverableTerm>}
                      value={`${design.architecture.database.type} — ${design.architecture.database.reason}`}
                    />
                    <DataCard
                      label={<HoverableTerm promptKey="architecture">Cache</HoverableTerm>}
                      value={`${design.architecture.cache.type} — ${design.architecture.cache.reason}`}
                    />
                    <DataCard
                      label={<HoverableTerm promptKey="architecture">Queue</HoverableTerm>}
                      value={`${design.architecture.queue.type} — ${design.architecture.queue.reason}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

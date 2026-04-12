import { motion } from 'framer-motion'
import { FolderTree, Code2, Rocket, DollarSign, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useDesignStore } from '@/store/useDesignStore'
import { HoverableTerm } from '@/components/HoverableTerm'
import type { ImplementationGuide, DevelopmentStep, Technology } from '@/types'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <ChevronRight className="h-3 w-3 text-cyan-500/70" />
      <span className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wider">
        {children}
      </span>
    </div>
  )
}

function ProjectStructureView({ projectStructure }: { projectStructure: string }) {
  return (
    <div className="rounded-md border border-slate-border/40 bg-obsidian/60 p-4">
      <pre className="font-mono text-xs text-zinc-300 whitespace-pre leading-relaxed overflow-x-auto">
        {projectStructure}
      </pre>
    </div>
  )
}

function DevelopmentStepsView({ steps }: { steps: DevelopmentStep[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3.5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-500/20 bg-cyan-500/5 text-xs font-bold font-mono text-cyan-400 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-semibold text-zinc-100">{step.title}</h3>
                <span className="font-mono text-xs text-zinc-400 bg-obsidian-surface px-2 py-0.5 rounded shrink-0">
                  ~{step.estimatedDays}d
                </span>
              </div>
              <p className="font-body text-xs text-zinc-400 mb-3">{step.description}</p>
              <div className="space-y-1.5">
                {step.tasks.map((task, j) => (
                  <div key={j} className="flex gap-2 font-body text-xs text-zinc-300">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-500/70" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
              {step.dependencies && step.dependencies.length > 0 && (
                <div className="mt-3 flex gap-1.5 font-mono text-xs text-zinc-500">
                  <span className="text-zinc-500">deps:</span>
                  {step.dependencies.join(', ')}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function TechnologyStackView({ techStack }: { techStack: ImplementationGuide['technologyStack'] }) {
  const categories = [
    { key: 'frontend' as const, label: 'Frontend', icon: '◈' },
    { key: 'backend' as const, label: 'Backend', icon: '⚙' },
    { key: 'database' as const, label: 'Database', icon: '◉' },
    { key: 'infrastructure' as const, label: 'Infrastructure', icon: '△' },
    { key: 'monitoring' as const, label: 'Monitoring', icon: '◐' },
  ]

  return (
    <div className="space-y-5">
      {categories.map((cat) => (
        <div key={cat.key}>
          <SectionLabel>
            <HoverableTerm promptKey="implementation">{cat.icon} {cat.label}</HoverableTerm>
          </SectionLabel>
          <div className="space-y-1.5">
            {techStack[cat.key].map((tech: Technology, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-body text-sm font-medium text-zinc-100">{tech.name}</span>
                </div>
                <p className="font-body text-xs text-zinc-400">{tech.purpose}</p>
                <p className="font-body text-xs text-cyan-400/80 mt-1">{tech.reason}</p>
                {tech.alternatives.length > 0 && (
                  <div className="flex gap-1.5 font-mono text-xs text-zinc-500 mt-1.5">
                    <span className="text-zinc-500">alt:</span>
                    <span>{tech.alternatives.join(', ')}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DeploymentGuideView({ guide }: { guide: ImplementationGuide['deploymentGuide'] }) {
  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Deployment Steps</SectionLabel>
        <div className="space-y-1.5">
          {guide.steps.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-cyan-500/25 bg-cyan-500/5 font-mono text-xs font-bold text-cyan-400">
                {i + 1}
              </div>
              <p className="font-body text-xs text-zinc-300">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Platforms</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {guide.platforms.map((platform, i) => (
            <span
              key={i}
              className="rounded-md border border-slate-border/40 bg-obsidian-surface/60 px-2.5 py-1 font-mono text-xs text-zinc-300"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Environment Variables</SectionLabel>
        <div className="space-y-1.5">
          {guide.environmentVariables.map((env, i) => (
            <div key={i} className="rounded-md border border-slate-border/30 bg-obsidian/60 p-3">
              <code className="font-mono text-xs text-cyan-400/90">{env.name}</code>
              <p className="font-body text-xs text-zinc-400 mt-1">{env.description}</p>
              <code className="font-mono text-xs text-zinc-500 mt-1 block">
                = {env.example}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CostEstimateView({ estimate }: { estimate: ImplementationGuide['costEstimate'] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-emerald-500/25 bg-emerald-500/5 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-emerald-400/80">Monthly Estimate</span>
          <span className="font-display text-2xl font-bold text-emerald-400">${estimate.monthly}</span>
        </div>
        <p className="font-body text-xs text-emerald-400/60 mt-2">{estimate.assumptions}</p>
      </div>

      <div>
        <SectionLabel>Breakdown</SectionLabel>
        <div className="space-y-1.5">
          {estimate.breakdown.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3"
            >
              <div>
                <p className="font-body text-sm font-medium text-zinc-200">{item.service}</p>
                <p className="font-body text-xs text-zinc-400">{item.description}</p>
              </div>
              <span className="font-mono text-sm font-semibold text-zinc-300">${item.cost}<span className="text-zinc-500 text-xs">/mo</span></span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BestPracticesView({ practices }: { practices: string[] }) {
  return (
    <div className="space-y-1.5">
      {practices.map((practice, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex gap-3 rounded-md border border-slate-border/30 bg-obsidian-soft/50 p-3"
        >
          <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400/70" />
          <p className="font-body text-xs text-zinc-300">{practice}</p>
        </motion.div>
      ))}
    </div>
  )
}

export function ImplementationGuidePanel() {
  const { design } = useDesignStore()

  if (!design?.implementation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Code2 className="h-10 w-10 text-zinc-600" />
        <p className="font-mono text-xs text-zinc-400">Implementation Guide</p>
        <p className="max-w-xs text-center font-body text-xs text-zinc-500">
          A complete step-by-step guide will appear here after generating your architecture
        </p>
      </div>
    )
  }

  const guide = design.implementation

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="structure" orientation="horizontal">
        <TabsList className="w-full bg-transparent border-0 p-0 gap-0.5 flex flex-wrap">
          <TabsTrigger value="structure" className="font-mono text-xs data-[state=active]:bg-obsidian-surface data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2.5 py-1.5">
            <FolderTree className="mr-1 h-3 w-3 text-cyan-500/60" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="steps" className="font-mono text-xs data-[state=active]:bg-obsidian-surface data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2.5 py-1.5">
            <Code2 className="mr-1 h-3 w-3 text-amber-400/60" />
            Steps
          </TabsTrigger>
          <TabsTrigger value="tech" className="font-mono text-xs data-[state=active]:bg-obsidian-surface data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2.5 py-1.5">
            <Rocket className="mr-1 h-3 w-3 text-blueprint-glow/60" />
            Tech
          </TabsTrigger>
          <TabsTrigger value="deploy" className="font-mono text-xs data-[state=active]:bg-obsidian-surface data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2.5 py-1.5">
            <Rocket className="mr-1 h-3 w-3 text-emerald-400/60" />
            Deploy
          </TabsTrigger>
          <TabsTrigger value="cost" className="font-mono text-xs data-[state=active]:bg-obsidian-surface data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2.5 py-1.5">
            <DollarSign className="mr-1 h-3 w-3 text-emerald-400/60" />
            Cost
          </TabsTrigger>
          <TabsTrigger value="best" className="font-mono text-xs data-[state=active]:bg-obsidian-surface data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm rounded-md px-2.5 py-1.5">
            <Lightbulb className="mr-1 h-3 w-3 text-amber-400/60" />
            Tips
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 space-y-4 overflow-y-auto mt-3 pr-0.5">
        <TabsContent value="structure" className="mt-0">
          <ProjectStructureView projectStructure={guide.projectStructure} />
        </TabsContent>

        <TabsContent value="steps" className="mt-0">
          <DevelopmentStepsView steps={guide.developmentSteps} />
        </TabsContent>

        <TabsContent value="tech" className="mt-0">
          <TechnologyStackView techStack={guide.technologyStack} />
        </TabsContent>

        <TabsContent value="deploy" className="mt-0">
          <DeploymentGuideView guide={guide.deploymentGuide} />
        </TabsContent>

        <TabsContent value="cost" className="mt-0">
          <CostEstimateView estimate={guide.costEstimate} />
        </TabsContent>

        <TabsContent value="best" className="mt-0">
          <BestPracticesView practices={guide.bestPractices} />
        </TabsContent>
      </div>
    </div>
  )
}

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Zap, Layers, FileText, Code2, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    icon: FileText,
    title: '1. Describe Your Idea',
    description: 'Type a description of what you want to build. Include scale expectations, tech preferences, or compliance needs.',
    example: '"A real-time collaborative whiteboard for remote teams, supporting 50 concurrent users with video chat."',
  },
  {
    icon: Cpu,
    title: '2. AI Generates Architecture',
    description: 'ArchAi analyzes your idea and produces a complete system design — services, databases, caches, queues, and how they connect.',
    example: 'Monolith vs microservices, PostgreSQL vs MongoDB, Redis caching, WebSocket connections.',
  },
  {
    icon: Layers,
    title: '3. Interactive Visualization',
    description: 'Your architecture appears as an interactive graph. Drag nodes, explore connections, and see data flow between components.',
    example: 'Frontend → API Gateway → Auth Service → Database, with labeled read/write/async edges.',
  },
  {
    icon: Zap,
    title: '4. Build Prompts Generated',
    description: 'Each node gets a tailored build prompt you can paste into Cursor, Windsurf, or v0 to generate that component.',
    example: '"Build a Node.js Express service with PostgreSQL that handles user authentication using JWT tokens..."',
  },
  {
    icon: Code2,
    title: '5. Implementation Guide',
    description: 'Get a step-by-step development plan with project structure, tech stack, deployment guide, and cost estimates.',
    example: 'Phase 1: Setup → Phase 2: Core API → Phase 3: Frontend → Phase 4: Deploy.',
  },
  {
    icon: Rocket,
    title: '6. Ship It',
    description: 'Follow the guide, use the prompts, and go from idea to production-ready system in hours instead of weeks.',
    example: 'Deploy to Vercel + Railway. Total cost: ~$30/month for 10K users.',
  },
]

const faqs = [
  {
    q: 'What AI providers does ArchAi support?',
    a: 'Groq, Anthropic (Claude), and Ollama (local). You configure your preferred provider in the backend .env file.',
  },
  {
    q: 'Can I customize the tech stack recommendations?',
    a: 'Yes. Include your preferences in the idea description (e.g., "using React and Go") and the AI will tailor the architecture accordingly.',
  },
  {
    q: 'Are my designs saved?',
    a: 'Yes. Designs are auto-saved to your browser\'s localStorage. You can also share designs via URL.',
  },
  {
    q: 'Is this free?',
    a: 'Currently free during the beta phase. Pricing will be introduced after demand validation.',
  },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const Icon = step.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4"
    >
      <div className="shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/5">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-zinc-100 mb-1">{step.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-2">{step.description}</p>
        <p className="text-xs font-mono text-zinc-500 bg-obsidian-soft/50 rounded px-3 py-2">{step.example}</p>
      </div>
    </motion.div>
  )
}

export function DocsPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />

      {/* Hero */}
      <div className="pt-24 pb-12 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 text-3xl font-bold font-display text-zinc-100"
          >
            How ArchAi Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-sm text-zinc-400"
          >
            From idea to production-ready system architecture in 6 steps.
          </motion.p>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 pb-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-16">
        <div className="mx-auto max-w-3xl rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Ready to build?</h2>
          <p className="text-sm text-zinc-400 mb-4">Start designing your system architecture now.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-6 py-2.5 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/50"
          >
            Launch ArchAi <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold font-display text-zinc-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-slate-border/30 bg-obsidian-soft/40 p-5"
              >
                <h3 className="text-sm font-medium text-zinc-200 mb-2">{faq.q}</h3>
                <p className="text-sm text-zinc-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Terminal, Cpu, Layers, Zap } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const features = [
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'AI-powered system architecture designed for your scale in seconds',
    accent: 'cyan' as const,
  },
  {
    icon: Layers,
    title: 'Best Practices',
    description: 'Architectures based on proven patterns from industry leaders',
    accent: 'blueprint' as const,
  },
  {
    icon: Cpu,
    title: 'Scalability',
    description: 'Solutions that grow with your system from 1K to 1M+ users',
    accent: 'amber' as const,
  },
]

const accentStyles = {
  cyan: {
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/20',
    hoverBorder: 'group-hover:border-cyan-500/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]',
  },
  blueprint: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/20',
    hoverBorder: 'group-hover:border-blue-500/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/20',
    hoverBorder: 'group-hover:border-amber-500/40',
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]',
  },
}

function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-60" />
      <div className="absolute inset-0 blueprint-grid-fine opacity-40" />

      <div className="absolute -top-60 -right-60 w-[500px] h-[500px] orb-blueprint blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] orb-cyan blur-3xl opacity-20" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-amber blur-3xl opacity-10" />

      <div className="absolute inset-0 scanline opacity-30" />
    </div>
  )
}

function TerminalPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-8 left-8 hidden lg:flex items-center gap-2 text-xs font-mono text-slate-faint"
    >
      <Terminal className="h-3 w-3" />
      <span>
        <span className="text-cyan-500">$</span> awaiting input<span className="cursor-blink">▊</span>
      </span>
    </motion.div>
  )
}

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian">
      <Navbar />
      <AnimatedGridBackground />
      <TerminalPrompt />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center mx-auto max-w-5xl px-6 pt-16">
        {/* Logo + Headline Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          {/* Logo Mark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 15 }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/5 glow-cyan">
              <Terminal className="h-5 w-5 text-cyan-400" />
              <div className="absolute -inset-1 rounded-lg border border-cyan-500/10" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-zinc-100">
              Arch<span className="text-cyan-400">Ai</span>
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="mb-6 text-5xl leading-[1.1] tracking-tight text-zinc-100 sm:text-7xl lg:text-8xl">
            Design Systems
            <br />
            <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-blueprint-glow to-cyan-400 bg-clip-text text-transparent">
              at Machine Speed
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-slate-muted" style={{ fontFamily: 'var(--font-body)' }}>
            Transform product ideas into production-ready architecture.
            <br className="hidden sm:block" />
            <span className="text-slate-faint">Get designs, API specs, and scaling strategies in seconds.</span>
          </p>

          {/* CTA */}
          <motion.button
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-8 py-3.5 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/50 glow-cyan"
          >
            <span className="relative z-10">Start Designing</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-cyan-500/10 transition-transform duration-500 group-hover:translate-x-0" />
          </motion.button>
        </motion.div>

        {/* Features Grid — Asymmetric */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {features.map((feature, i) => {
            const style = accentStyles[feature.accent]
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.1 }}
                whileHover={{ y: -2 }}
                className={`group relative overflow-hidden rounded-lg border ${style.border} ${style.hoverBorder} bg-obsidian-soft/80 backdrop-blur-sm p-6 transition-all duration-300 ${style.glow}`}
              >
                <div className={`absolute -top-8 -right-8 h-16 w-16 ${style.iconBg} rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`mb-4 inline-flex rounded-md ${style.iconBg} p-2.5 ${style.iconColor} transition-colors`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mb-1.5 font-display text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-slate-muted group-hover:text-zinc-400 transition-colors">
                    {feature.description}
                  </p>
                </div>

                <div className={`absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-${feature.accent === 'blueprint' ? 'blue' : feature.accent}-500/50 to-transparent transition-all duration-500 group-hover:w-full`} />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center justify-center gap-6 text-xs font-mono text-slate-faint"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Online
          </span>
          <span className="text-slate-border">│</span>
          <span>Providers: Groq · Anthropic · Ollama</span>
          <span className="text-slate-border">│</span>
          <span>v1.0.0</span>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

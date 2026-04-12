import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Sparkles, Zap, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Explore and learn',
    icon: Sparkles,
    features: [
      '2 designs per month',
      'Basic architecture generation',
      'Interactive visualization',
      'Shareable links',
      'Design history (last 5)',
    ],
    cta: 'Get Started',
    ctaLink: '/dashboard',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious builders',
    icon: Zap,
    features: [
      'Unlimited designs',
      'Advanced architecture with AI refinement',
      'Build prompt packs for Cursor/Windsurf',
      'Full design history',
      'Export to Markdown/PDF',
      'Priority AI processing',
      'Custom tech stack templates',
    ],
    cta: 'Start Building',
    ctaLink: '/dashboard',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For teams shipping fast',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared design library',
      'Collaborative refinement',
      'API access',
      'SSO / SAML auth',
      'Dedicated support',
    ],
    cta: 'Contact Us',
    ctaLink: '/docs',
    highlighted: false,
  },
]

function PlanCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const Icon = plan.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col rounded-lg border p-6 transition-all ${
        plan.highlighted
          ? 'border-cyan-500/40 bg-obsidian-surface/60 shadow-[0_0_40px_rgba(6,182,212,0.06)]'
          : 'border-slate-border/40 bg-obsidian-soft/40'
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-[10px] font-mono text-cyan-400">
          MOST POPULAR
        </div>
      )}

      <div className="mb-4">
        <Icon className={`h-6 w-6 mb-3 ${plan.highlighted ? 'text-cyan-400' : 'text-zinc-500'}`} />
        <h3 className="text-lg font-semibold text-zinc-100">{plan.name}</h3>
        <p className="text-xs text-zinc-500 mt-0.5">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold font-display text-zinc-100">{plan.price}</span>
        {plan.period && <span className="text-sm text-zinc-500">{plan.period}</span>}
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
            <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to={plan.ctaLink}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
          plan.highlighted
            ? 'border border-cyan-500/30 bg-cyan-500/5 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/50'
            : 'border border-slate-border/60 text-zinc-300 hover:text-zinc-100 hover:border-slate-border/40'
        }`}
      >
        {plan.cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  )
}

export function PricingPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />

      {/* Hero */}
      <div className="pt-24 pb-12 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 text-3xl font-bold font-display text-zinc-100"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-sm text-zinc-400 max-w-lg mx-auto"
          >
            Start free. Upgrade when you need more power. No surprises.
          </motion.p>
        </div>
      </div>

      {/* Plans */}
      <div className="px-6 pb-16">
        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>
      </div>

      {/* Trust */}
      <div className="px-6 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-zinc-500">
            Free during beta. No credit card required. Cancel anytime.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

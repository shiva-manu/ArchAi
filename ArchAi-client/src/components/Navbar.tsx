import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-border/50 bg-obsidian/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative flex h-7 w-7 items-center justify-center rounded border border-cyan-500/20 bg-cyan-500/5"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          </motion.div>
          <div>
            <span className="font-display text-sm font-semibold tracking-tight text-zinc-100">
              Arch<span className="text-cyan-400">Ai</span>
            </span>
          </div>
        </Link>

        {/* Center - Status */}
        <div className="hidden items-center gap-4 text-xs font-mono text-slate-faint md:flex">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
            Ready
          </span>
          <span className="text-slate-border">/</span>
          <span className="text-slate-muted/60">localhost:3000</span>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="text-xs font-medium text-zinc-100 border border-slate-border/60 bg-obsidian-elevated/50 hover:bg-obsidian-surface/60 px-3.5 py-1.5 rounded-md transition-all font-mono">
            {'>_'} Launch
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Gallery', to: '/gallery' },
  { label: 'Docs', to: '/docs' },
  { label: 'Pricing', to: '/pricing' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

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
          <span className="font-display text-sm font-semibold tracking-tight text-zinc-100">
            Arch<span className="text-cyan-400">Ai</span>
          </span>
        </Link>

        {/* Center - Nav Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right - CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/dashboard"
            className="text-xs font-medium text-zinc-100 border border-slate-border/60 bg-obsidian-elevated/50 hover:bg-obsidian-surface/60 px-3.5 py-1.5 rounded-md transition-all font-mono"
          >
            {'>_'} {isLanding ? 'Launch' : 'Workspace'}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-border/30 bg-obsidian/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center text-xs font-medium text-zinc-100 border border-slate-border/60 bg-obsidian-elevated/50 px-3.5 py-2 rounded-md transition-all font-mono"
              >
                {'>_'} {isLanding ? 'Launch' : 'Workspace'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

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
  const isDashboard = location.pathname === '/dashboard'

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-border/30 bg-obsidian/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center px-6">
        {/* Logo — left, fixed width */}
        <div className="flex w-40 items-center">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-7 w-7 items-center justify-center rounded-md border border-cyan-500/20 bg-cyan-500/5 transition-colors group-hover:border-cyan-500/40"
            >
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            </motion.div>
            <span className="font-display text-sm font-semibold tracking-tight text-zinc-100">
              Arch<span className="text-cyan-400">Ai</span>
            </span>
          </Link>
        </div>

        {/* Nav Links — center, equally spaced, flex-1 */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-1.5 text-sm font-medium transition-colors group"
              >
                <span className={`relative z-10 ${
                  isActive
                    ? 'text-zinc-100'
                    : 'text-zinc-400 group-hover:text-zinc-200'
                }`}>
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-md bg-zinc-800/60"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-md bg-zinc-800/0 group-hover:bg-zinc-800/40 transition-colors" />
                )}
              </Link>
            )
          })}
        </div>

        {/* CTA — right, fixed width, aligned with logo */}
        <div className="flex w-40 items-center justify-end">
          <Link
            to={isDashboard ? '/' : '/dashboard'}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-cyan-500/20 bg-cyan-500/5 px-3.5 py-1.5 text-xs font-mono font-medium text-cyan-300 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10"
          >
            <span className="relative z-10">
              {'>_'} {isLanding || isDashboard ? 'Launch' : 'Workspace'}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-cyan-500/10 transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-3 md:hidden text-zinc-400 hover:text-zinc-100 transition-colors p-1"
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
            className="md:hidden border-t border-slate-border/30 bg-obsidian/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-800/60 text-zinc-100'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link
                to={isDashboard ? '/' : '/dashboard'}
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center text-xs font-medium text-cyan-300 border border-cyan-500/20 bg-cyan-500/5 px-3.5 py-2.5 rounded-md transition-all font-mono"
              >
                {'>_'} {isLanding || isDashboard ? 'Launch' : 'Workspace'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

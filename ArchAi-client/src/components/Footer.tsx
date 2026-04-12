import { Link } from 'react-router-dom'
import { Terminal } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-border/30 bg-obsidian-soft/40">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <Terminal className="h-4 w-4" />
            <span className="font-display text-sm font-medium">
              Arch<span className="text-cyan-500/60">Ai</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <Link to="/gallery" className="hover:text-zinc-300 transition-colors">Gallery</Link>
            <Link to="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
            <Link to="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} ArchAi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

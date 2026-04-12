import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  name: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, this would send to an error tracking service
    // For now, log it so we can see it in dev
    // eslint-disable-next-line no-console
    console.error(`[${this.props.name}] ErrorBoundary caught:`, error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex h-full min-h-[200px] items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                {this.props.name} encountered an error
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {this.state.error?.message || 'Something went wrong'}
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/10"
            >
              <RotateCcw className="h-3 w-3" />
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

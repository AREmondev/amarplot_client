'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { trackError } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  eventId: string | null
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const eventId = this.generateEventId()
    
    this.setState({
      errorInfo,
      eventId,
    })

    // Track error with analytics
    trackError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      eventId,
      props: this.props,
    })

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary()
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary()
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    })
  }

  handleRetry = () => {
    this.resetErrorBoundary()
    
    // Add a small delay to prevent immediate re-error
    this.resetTimeoutId = window.setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          eventId={this.state.eventId}
          onRetry={this.handleRetry}
          onReset={this.resetErrorBoundary}
        />
      )
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  eventId: string | null
  onRetry: () => void
  onReset: () => void
}

function ErrorFallback({ error, errorInfo, eventId, onRetry, onReset }: ErrorFallbackProps) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
    onReset()
  }

  const handleReportIssue = () => {
    const subject = encodeURIComponent(`Error Report - ${eventId}`)
    const body = encodeURIComponent(`
Error: ${error?.message}
Event ID: ${eventId}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Please describe what you were doing when this error occurred:
`)
    
    window.open(`mailto:support@amarplot.com?subject=${subject}&body=${body}`)
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          {eventId && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Error ID: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{eventId}</code>
            </p>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium text-red-800 dark:text-red-200">
              Error Details (Development)
            </summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>Message:</strong>
                <pre className="text-sm bg-red-100 dark:bg-red-900/40 p-2 rounded mt-1 overflow-auto">
                  {error.message}
                </pre>
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded mt-1 overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded mt-1 overflow-auto max-h-32">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button variant="outline" onClick={handleGoHome} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          
          <Button variant="ghost" onClick={handleReportIssue} className="flex items-center gap-2">
            Report Issue
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-500">
          If this problem persists, please contact our support team.
        </div>
      </div>
    </div>
  )
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    trackError(error, {
      ...errorInfo,
      hookBased: true,
    })
  }
}

// HOC for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertOctagon } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-4">
                <AlertOctagon className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Critical Error</h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We encountered a critical error. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} variant="default">
                Try Again
              </Button>
              <Button onClick={() => window.location.href = "/"} variant="outline">
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
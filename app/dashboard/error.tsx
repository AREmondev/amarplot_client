"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertOctagon } from "lucide-react"

export default function DashboardError({
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <AlertOctagon className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We encountered an error while loading this page. Please try again or return to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/overview">
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
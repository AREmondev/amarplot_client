import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-yellow-100 p-4">
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the dashboard page you&apos;re looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/dashboard/overview">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
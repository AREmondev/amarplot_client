import { Skeleton } from "@/components/ui/skeleton"
import DashboardSidebar from "./components/dashboard-sidebar"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar activePage="overview" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
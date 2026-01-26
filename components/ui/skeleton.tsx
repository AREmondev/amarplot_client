import { cn } from "@/lib/utils"
import React from "react"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Specialized skeleton components
function SkeletonText({ 
  lines = 1, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

function SkeletonAvatar({ 
  size = "md",
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { 
  size?: "sm" | "md" | "lg" | "xl" 
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  return (
    <Skeleton
      className={cn("rounded-full", sizeClasses[size], className)}
      {...props}
    />
  )
}

function SkeletonButton({ 
  size = "md",
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { 
  size?: "sm" | "md" | "lg" 
}) {
  const sizeClasses = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-28",
  }

  return (
    <Skeleton
      className={cn("rounded-md", sizeClasses[size], className)}
      {...props}
    />
  )
}

function SkeletonCard({ 
  className,
  children,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children || (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <SkeletonAvatar />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <SkeletonText lines={3} />
          <div className="flex space-x-2">
            <SkeletonButton size="sm" />
            <SkeletonButton size="sm" />
          </div>
        </div>
      )}
    </div>
  )
}

// Property card skeleton
function SkeletonPropertyCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden shadow-sm",
        className
      )}
      {...props}
    >
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />
      
      <div className="p-4 space-y-3">
        {/* Title and price */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        
        {/* Location */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Features */}
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 pt-2">
          <SkeletonButton className="flex-1" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  )
}

// Loading wrapper component
function SkeletonWrapper({
  isLoading,
  skeleton,
  children,
  className,
  ...props
}: {
  isLoading: boolean
  skeleton: React.ReactNode
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)} {...props}>
        {skeleton}
      </div>
    )
  }

  return <>{children}</>
}

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonPropertyCard,
  SkeletonWrapper,
}

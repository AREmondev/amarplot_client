"use client"

import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message = "Loading...", fullScreen = false }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' : 'py-12'}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-background" />
          </div>
        </div>
        {message && (
          <p className="text-muted-foreground text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  )
}
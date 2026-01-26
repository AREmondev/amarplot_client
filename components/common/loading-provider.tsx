"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { LoadingScreen } from './loading-screen'

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  loadingMessage: string
  setLoadingMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingMessage,
        setLoadingMessage,
      }}
    >
      {isLoading && <LoadingScreen message={loadingMessage} fullScreen={true} />}
      {children}
    </LoadingContext.Provider>
  )
}
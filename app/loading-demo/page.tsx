"use client"

import { LoadingExample } from "@/components/common/loading-example"

export default function LoadingDemoPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Global Loading System</h1>
          <p className="text-muted-foreground">
            This page demonstrates the global loading system implemented in AmarPlot.
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Loading Examples</h2>
          <LoadingExample />
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Documentation</h2>
          <p className="mb-4">
            The global loading system provides a consistent way to show loading states across the application.
            It consists of the following components:
          </p>
          
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>LoadingScreen</strong> - A reusable loading component with spinner and message</li>
            <li><strong>LoadingProvider</strong> - A context provider for managing global loading state</li>
            <li><strong>useGlobalLoading</strong> - A hook for controlling the loading state</li>
            <li><strong>useLoadingFn</strong> - A utility hook for wrapping async functions with loading state</li>
          </ul>
          
          <p>
            For more detailed documentation, please refer to the <code>README-loading.md</code> file in the <code>components/common</code> directory.
          </p>
        </div>
      </div>
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { useGlobalLoading } from "@/hooks/use-global-loading"
import { useLoadingFn } from "@/utils/with-loading"

export function LoadingExample() {
  const { showLoading, hideLoading } = useGlobalLoading()

  // Example 1: Direct use of useGlobalLoading
  const handleShowLoading = () => {
    showLoading("Processing your request...")
    // Simulate an async operation
    setTimeout(() => {
      hideLoading()
    }, 3000)
  }

  // Example 2: Using the useLoadingFn hook
  const simulateAsyncOperation = useLoadingFn(
    async () => {
      // Simulate an API call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve("Operation completed!")
        }, 3000)
      })
    },
    "Fetching data..."
  )

  return (
    <div className="p-4 border rounded-md space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Loading Example</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to show the global loading screen for 3 seconds.
        </p>
        <Button onClick={handleShowLoading}>Show Loading</Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">useLoadingFn Example</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This example uses the useLoadingFn hook to automatically handle loading state.
        </p>
        <Button onClick={async () => {
          const result = await simulateAsyncOperation()
          console.log(result)
        }}>Simulate API Call</Button>
      </div>
    </div>
  )
}
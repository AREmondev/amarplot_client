# Global Loading System

This document explains how to use the global loading system in the AmarPlot application.

## Components

### LoadingScreen

A reusable loading component that displays a spinner with an optional message.

```tsx
import { LoadingScreen } from '@/components/common/loading-screen';

// Basic usage
<LoadingScreen />

// With custom message
<LoadingScreen message="Loading properties..." />

// Full screen overlay
<LoadingScreen fullScreen={true} message="Processing your request..." />
```

### LoadingProvider

A context provider that manages the global loading state. This is already set up at the root level in `app/layout.tsx`.

## Hooks

### useGlobalLoading

A custom hook that provides methods to control the global loading state.

```tsx
import { useGlobalLoading } from '@/hooks/use-global-loading';

function MyComponent() {
  const { showLoading, hideLoading } = useGlobalLoading();
  
  const handleSubmit = async () => {
    // Show loading with custom message
    showLoading('Submitting your form...');
    
    try {
      // Perform async operation
      await submitForm();
    } finally {
      // Hide loading when done
      hideLoading();
    }
  };
  
  return (
    <button onClick={handleSubmit}>Submit</button>
  );
}
```

### useLoadingFn

A custom hook that wraps an async function with loading state management. This is a more convenient way to handle loading states for async operations.

```tsx
import { useLoadingFn } from '@/utils/with-loading';

function MyComponent() {
  // Create a wrapped version of your async function
  const submitFormWithLoading = useLoadingFn(
    async (formData) => {
      const response = await api.submitForm(formData);
      return response.data;
    },
    'Submitting your form...' // Optional loading message
  );
  
  const handleSubmit = async (formData) => {
    // The loading state is automatically managed
    const result = await submitFormWithLoading(formData);
    console.log(result);
  };
  
  return (
    <button onClick={() => handleSubmit(formData)}>Submit</button>
  );
}
```

## Best Practices

1. **API Calls**: Use the loading system for API calls that might take time to complete.

```tsx
const { showLoading, hideLoading } = useGlobalLoading();

const fetchData = async () => {
  showLoading('Fetching data...');
  try {
    const response = await api.getData();
    return response.data;
  } finally {
    hideLoading();
  }
};
```

2. **Form Submissions**: Show loading during form submissions to prevent multiple submissions.

3. **Page Transitions**: For complex page transitions that require data loading.

4. **File Operations**: When uploading or processing files.

## Example

See `components/common/loading-example.tsx` for a complete example of how to use the global loading system.
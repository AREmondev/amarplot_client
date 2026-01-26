# Performance Optimization Guidelines for AmarPlot

## Navigation Performance

### Client-Side Navigation

- **Use Next.js Link Components**: Always use `<Link>` components instead of `router.push()` for internal navigation. This enables client-side transitions without full page reloads.

```tsx
// ✅ Good - Uses client-side navigation
<Link href="/dashboard/properties" className="...">
  My Properties
</Link>

// ❌ Bad - Causes full page transitions
<Button onClick={() => router.push('/dashboard/properties')}>
  My Properties
</Button>
```

### Data Fetching

- **Use SWR for Data Fetching**: Implement the `useDataFetch` hook for all API calls to benefit from:
  - Automatic caching
  - Deduplication of requests
  - Focus revalidation (configurable)
  - Revalidation on reconnect
  - Error retry with exponential backoff

```tsx
// Example usage
const { data, error, isLoading } = useDataFetch({
  url: '/api/properties',
});
```

### Authentication

- **Optimize Token Refresh**: The token refresh mechanism has been optimized to:
  - Cache in-flight refresh requests
  - Prevent multiple simultaneous refresh attempts
  - Handle errors gracefully

### Code Splitting

- **Use Dynamic Imports**: For large components or pages that aren't needed immediately:

```tsx
// Dynamic import with loading state
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

### Image Optimization

- **Use Next.js Image Component**: Always use the `next/image` component for better performance:

```tsx
import Image from 'next/image';

// Example usage
<Image 
  src="/path/to/image.jpg" 
  alt="Description" 
  width={500} 
  height={300} 
  priority={isAboveFold} // Set true for above-the-fold images
/>
```

### State Management

- **Use Zustand Efficiently**: 
  - Keep store definitions small and focused
  - Use selectors to prevent unnecessary re-renders
  - Implement middleware like `persist` for state that needs to survive page refreshes

### Next.js Configuration

- **Enable Performance Features**:
  - `swcMinify`: Use the SWC minifier for faster builds
  - `removeConsole`: Remove console statements in production
  - `reactStrictMode`: Catch potential issues early
  - `optimizeCss`: Optimize CSS for production

### API Client

- **Optimize Axios Configuration**:
  - Set reasonable timeouts
  - Configure default headers
  - Implement efficient token refresh
  - Use request/response interceptors judiciously

## Monitoring Performance

- Use Lighthouse in Chrome DevTools to measure performance
- Monitor Core Web Vitals (LCP, FID, CLS)
- Use the Network tab to identify slow API calls
- Use the Performance tab to identify JavaScript bottlenecks
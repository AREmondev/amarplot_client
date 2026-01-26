import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { renderHook, RenderHookOptions, RenderHookResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';

// Jest mock function interface
interface MockFunction {
  (...args: any[]): any;
  mockImplementation?: (fn: (...args: any[]) => any) => MockFunction;
  mockReturnValue?: (value: any) => MockFunction;
  mockResolvedValue?: (value: any) => MockFunction;
  mockRejectedValue?: (value: any) => MockFunction;
  mockClear?: () => MockFunction;
  mockReset?: () => MockFunction;
  mockRestore?: () => MockFunction;
}

// Fallback for jest when not in test environment
const mockJest = {
  fn: (implementation?: (...args: any[]) => any): MockFunction => {
    const fn = (implementation || (() => {})) as MockFunction;
    fn.mockImplementation = (impl: any) => {
      Object.assign(fn, impl);
      return fn;
    };
    fn.mockReturnValue = (value: any) => {
      (fn as any).mockReturnValueOnce = () => fn;
      return fn;
    };
    fn.mockResolvedValue = (value: any) => {
      (fn as any).mockResolvedValueOnce = () => fn;
      return fn;
    };
    fn.mockRejectedValue = (value: any) => {
      (fn as any).mockRejectedValueOnce = () => fn;
      return fn;
    };
    fn.mockRestore = () => fn;
    fn.mockClear = () => fn;
    fn.mockReset = () => fn;
    return fn;
  },
  spyOn: (object: any, method: string) => {
    const original = object[method];
    const spy = mockJest.fn();
    object[method] = spy;
    if (spy.mockRestore) {
      spy.mockRestore = () => {
        object[method] = original;
        return spy;
      };
    }
    return spy;
  },
  clearAllMocks: () => {},
  resetAllMocks: () => {},
  restoreAllMocks: () => {},
};

// Use global jest if available, otherwise use mock
const testJest = (typeof globalThis !== 'undefined' && (globalThis as any).jest) || 
                 (typeof global !== 'undefined' && (global as any).jest) || 
                 mockJest;

// Mock data generators
export const mockData = {
  property: (overrides: Partial<any> = {}) => ({
    id: 'prop-123',
    title: 'Beautiful 3BR Apartment',
    description: 'A stunning apartment in the heart of the city',
    price: 50000,
    currency: 'BDT',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    location: {
      address: '123 Main St',
      city: 'Dhaka',
      state: 'Dhaka Division',
      country: 'Bangladesh',
      coordinates: { lat: 23.8103, lng: 90.4125 },
    },
    images: ['/images/property-1.jpg', '/images/property-2.jpg'],
    amenities: ['Parking', 'Gym', 'Swimming Pool'],
    type: 'apartment',
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),
  
  user: (overrides: Partial<any> = {}) => ({
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/images/avatar.jpg',
    role: 'user',
    preferences: {
      currency: 'BDT',
      language: 'en',
      notifications: true,
    },
    createdAt: new Date().toISOString(),
    ...overrides,
  }),
  
  searchFilters: (overrides: Partial<any> = {}) => ({
    query: '',
    location: '',
    priceRange: [0, 100000],
    bedrooms: null,
    bathrooms: null,
    propertyType: '',
    amenities: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...overrides,
  }),
  
  apiResponse: (data: any, overrides: Partial<any> = {}) => ({
    success: true,
    data,
    message: 'Success',
    pagination: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
    ...overrides,
  }),
  
  error: (message: string = 'Something went wrong', code: number = 500) => ({
    success: false,
    error: {
      message,
      code,
      details: {},
    },
  }),
};

// Test providers wrapper
interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
  theme?: string;
}

// Create a default query client for testing
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

function TestProviders({ children, queryClient, theme = 'light' }: TestProvidersProps) {
  const testQueryClient = queryClient || createTestQueryClient();
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme={theme}
        enableSystem={false}
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  theme?: string;
  user?: any;
}

export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { queryClient, theme, user: userOverrides, ...renderOptions } = options;
  
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders queryClient={queryClient} theme={theme}>
      {children}
    </TestProviders>
  );
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Custom render hook function
interface CustomRenderHookOptions<TProps> extends Omit<RenderHookOptions<TProps>, 'wrapper'> {
  queryClient?: QueryClient;
  theme?: string;
}

export function customRenderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options: CustomRenderHookOptions<TProps> = {}
): RenderHookResult<TResult, TProps> {
  const { queryClient, theme, ...renderHookOptions } = options;
  
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders queryClient={queryClient} theme={theme}>
      {children}
    </TestProviders>
  );
  
  return renderHook(hook, { wrapper: Wrapper, ...renderHookOptions });
}

// Mock API functions
export const mockApi = {
  // Mock fetch with custom responses
  mockFetch: (response: any, status: number = 200) => {
    global.fetch = testJest.fn(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
        headers: new Headers(),
        redirected: false,
        statusText: status === 200 ? 'OK' : 'Error',
        type: 'basic' as ResponseType,
        url: '',
        clone: testJest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: testJest.fn(),
        blob: testJest.fn(),
        formData: testJest.fn(),
      } as Response)
    );
  },
  
  // Mock fetch with delay
  mockFetchWithDelay: (response: any, delay: number = 100, status: number = 200) => {
    global.fetch = testJest.fn(() =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: status >= 200 && status < 300,
            status,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve(JSON.stringify(response)),
            headers: new Headers(),
            redirected: false,
            statusText: status === 200 ? 'OK' : 'Error',
            type: 'basic' as ResponseType,
            url: '',
            clone: testJest.fn(),
            body: null,
            bodyUsed: false,
            arrayBuffer: testJest.fn(),
            blob: testJest.fn(),
            formData: testJest.fn(),
          } as Response);
        }, delay);
      })
    );
  },
  
  // Mock fetch with error
  mockFetchError: (error: string = 'Network error') => {
    global.fetch = testJest.fn(() => Promise.reject(new Error(error)));
  },
  
  // Reset fetch mock
  resetFetch: () => {
    if (global.fetch && typeof global.fetch === 'function' && 'mockRestore' in global.fetch) {
      (global.fetch as any).mockRestore();
    }
  },
};

// Mock localStorage
export const mockLocalStorage = {
  setup: () => {
    const localStorageMock = {
      getItem: testJest.fn(),
      setItem: testJest.fn(),
      removeItem: testJest.fn(),
      clear: testJest.fn(),
      length: 0,
      key: testJest.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    return localStorageMock;
  },
  
  reset: () => {
    if (window.localStorage) {
      window.localStorage.clear();
    }
  },
};

// Mock sessionStorage
export const mockSessionStorage = {
  setup: () => {
    const sessionStorageMock = {
      getItem: testJest.fn(),
      setItem: testJest.fn(),
      removeItem: testJest.fn(),
      clear: testJest.fn(),
      length: 0,
      key: testJest.fn(),
    };
    
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
    
    return sessionStorageMock;
  },
  
  reset: () => {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
  },
};

// Mock window methods
export const mockWindow = {
  mockLocalStorage: () => {
    const store: Record<string, string> = {};
    const localStorage = {
      getItem: testJest.fn((key: string) => store[key] || null),
      setItem: testJest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: testJest.fn((key: string) => {
        delete store[key];
      }),
      clear: testJest.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      key: testJest.fn((index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      }),
      get length() {
        return Object.keys(store).length;
      },
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorage,
      writable: true,
    });
    
    return { localStorage };
  },
  
  mockSessionStorage: () => {
    const store: Record<string, string> = {};
    const sessionStorage = {
      getItem: testJest.fn((key: string) => store[key] || null),
      setItem: testJest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: testJest.fn((key: string) => {
        delete store[key];
      }),
      clear: testJest.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      key: testJest.fn((index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      }),
      get length() {
        return Object.keys(store).length;
      },
    };
    
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorage,
      writable: true,
    });
    
    return { sessionStorage };
  },
  
  mockScrollTo: () => {
    Object.defineProperty(window, 'scrollTo', {
      value: testJest.fn(),
      writable: true,
    });
  },
  
  mockMatchMedia: (matches: boolean = false) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: testJest.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: testJest.fn(),
        removeListener: testJest.fn(),
        addEventListener: testJest.fn(),
        removeEventListener: testJest.fn(),
        dispatchEvent: testJest.fn(),
      })),
    });
  },
  
  mockIntersectionObserver: () => {
    const mockIntersectionObserver = testJest.fn();
    if (mockIntersectionObserver.mockReturnValue) {
      mockIntersectionObserver.mockReturnValue({
        observe: testJest.fn(),
        unobserve: testJest.fn(),
        disconnect: testJest.fn(),
      });
    }
    
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: mockIntersectionObserver,
    });
    
    Object.defineProperty(global, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: mockIntersectionObserver,
    });
  },
  
  mockResizeObserver: () => {
    const mockResizeObserver = testJest.fn();
    if (mockResizeObserver.mockReturnValue) {
      mockResizeObserver.mockReturnValue({
        observe: testJest.fn(),
        unobserve: testJest.fn(),
        disconnect: testJest.fn(),
      });
    }
    
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: mockResizeObserver,
    });
    
    Object.defineProperty(global, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: mockResizeObserver,
    });
  },
  
  mockGeolocation: (coords: { latitude: number; longitude: number }) => {
    const getCurrentPositionMock = testJest.fn();
    if (getCurrentPositionMock.mockImplementation) {
      getCurrentPositionMock.mockImplementation((success: any) => {
        success({
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
      });
    }
    
    const mockGeolocation = {
      getCurrentPosition: getCurrentPositionMock,
      watchPosition: testJest.fn(),
      clearWatch: testJest.fn(),
    };
    
    // Mock geolocation by overriding the existing property
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });
    
    return mockGeolocation;
  },
};

// Test utilities
export const testUtils = {
  // Wait for element to appear
  waitForElement: async (getByTestId: any, testId: string, timeout: number = 1000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Element with testId "${testId}" not found within ${timeout}ms`));
      }, timeout);
      
      const checkElement = () => {
        try {
          const element = getByTestId(testId);
          clearTimeout(timer);
          resolve(element);
        } catch {
          setTimeout(checkElement, 50);
        }
      };
      
      checkElement();
    });
  },
  
  // Wait for element to appear with better error handling
  waitForElementToAppear: async (selector: string, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
      }, timeout);
      
      const checkElement = () => {
        try {
          const element = document.querySelector(`[data-testid="${selector}"]`) || 
                         Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes(selector));
          if (element) {
            clearTimeout(timer);
            resolve(element);
          } else {
            setTimeout(checkElement, 50);
          }
        } catch {
          setTimeout(checkElement, 50);
        }
      };
      
      checkElement();
    });
  },
  
  // Simulate file upload
  createMockFile: (content: string = 'test content', name: string = 'test.jpg', type: string = 'image/jpeg') => {
    const file = new File([content], name, { type });
    return file;
  },
  
  // Create mock FormData
  createMockFormData: (data: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });
    return formData;
  },
  

  
  // Mock clipboard
  mockClipboard: () => {
    const writeTextMock = testJest.fn();
    if (writeTextMock.mockResolvedValue) writeTextMock.mockResolvedValue(undefined);
    const readTextMock = testJest.fn();
    if (readTextMock.mockResolvedValue) readTextMock.mockResolvedValue('');
    
    const mockClipboard = {
      writeText: writeTextMock,
      readText: readTextMock,
    };
    
    try {
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true,
      });
    } catch (e) {
      // Property already exists, just assign it
      (navigator as any).clipboard = mockClipboard;
    }
    
    return mockClipboard;
  },
  
  // Create mock router
  createMockRouter: (overrides: Partial<any> = {}) => ({
    push: testJest.fn(),
    replace: testJest.fn(),
    back: testJest.fn(),
    forward: testJest.fn(),
    refresh: testJest.fn(),
    prefetch: testJest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
    basePath: '',
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    isFallback: false,
    events: {
      on: testJest.fn(),
      off: testJest.fn(),
      emit: testJest.fn(),
    },
    ...overrides,
  }),
};

// Custom matchers
export const customMatchers = {
  // Check if element has specific class
  toHaveClass: (received: Element, className: string) => {
    const pass = received.classList.contains(className);
    return {
      message: () => 
        pass
          ? `Expected element not to have class "${className}"`
          : `Expected element to have class "${className}"`,
      pass,
    };
  },
  
  // Check if element is visible
  toBeVisible: (received: Element) => {
    const pass = (received as HTMLElement).offsetParent !== null;
    return {
      message: () => 
        pass
          ? 'Expected element not to be visible'
          : 'Expected element to be visible',
      pass,
    };
  },
  
  // Check if element has focus
  toHaveFocus: (received: Element) => {
    const pass = document.activeElement === received;
    return {
      message: () => 
        pass
          ? 'Expected element not to have focus'
          : 'Expected element to have focus',
      pass,
    };
  },
};

// Performance testing utilities
export const performanceUtils = {
  // Measure component render time
  measureRenderTime: async (renderFn: () => void): Promise<number> => {
    const start = performance.now();
    await renderFn();
    const end = performance.now();
    return end - start;
  },
  
  // Check for memory leaks
  checkMemoryUsage: (): number => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  },
  
  // Simulate slow network
  simulateSlowNetwork: (delay: number = 3000) => {
    const originalFetch = global.fetch;
    global.fetch = testJest.fn((...args: Parameters<typeof fetch>) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(originalFetch.apply(null, args));
        }, delay);
      });
    });
  },
};

// Accessibility testing utilities
export const a11yUtils = {
  // Check for proper ARIA labels
  checkAriaLabels: (container: HTMLElement): string[] => {
    const issues: string[] = [];
    const interactiveElements = container.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]'
    );
    
    interactiveElements.forEach((element, index) => {
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      const hasTitle = element.hasAttribute('title');
      const hasTextContent = element.textContent?.trim();
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasTextContent) {
        issues.push(`Interactive element at index ${index} lacks accessible name`);
      }
    });
    
    return issues;
  },
  
  // Check color contrast (simplified)
  checkColorContrast: (element: HTMLElement): boolean => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // This is a simplified check - in real scenarios, use a proper contrast checker
    return color !== backgroundColor;
  },
  
  // Check keyboard navigation
  checkKeyboardNavigation: async (container: HTMLElement, user: any): Promise<boolean> => {
    const focusableElements = container.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return true;
    
    // Focus first element
    (focusableElements[0] as HTMLElement).focus();
    
    // Try to tab through all elements
    for (let i = 1; i < focusableElements.length; i++) {
      await user.keyboard('{Tab}');
      if (document.activeElement !== focusableElements[i]) {
        return false;
      }
    }
    
    return true;
  },
};

// Export everything for easy importing
export {
  customRender as render,
  customRenderHook as renderHook,
  TestProviders,
};

// Re-export testing library utilities
export {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
  fireEvent,
  cleanup,
  act,
} from '@testing-library/react';
export { userEvent };
// Type definitions for testing utilities and Jest

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveClass(className: string): R;
      toBeVisible(): R;
      toHaveFocus(): R;
    }
  }

  // Jest global functions
  var jest: {
    fn: <T extends (...args: any[]) => any>(implementation?: T) => jest.MockedFunction<T>;
    mock: (moduleName: string, factory?: () => any, options?: any) => any;
    unmock: (moduleName: string) => any;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
    setTimeout: (timeout: number) => void;
    useFakeTimers: (config?: any) => void;
    useRealTimers: () => void;
    runOnlyPendingTimers: () => void;
    runAllTimers: () => void;
    advanceTimersByTime: (msToRun: number) => void;
    spyOn: <T extends {}, M extends keyof T>(
      object: T,
      method: M
    ) => jest.SpyInstance<T[M] extends (...args: any[]) => any ? ReturnType<T[M]> : any, T[M] extends (...args: any[]) => any ? Parameters<T[M]> : any[]>;
  };

  interface MockedFunction<T extends (...args: any[]) => any> extends Function {
    (...args: Parameters<T>): ReturnType<T>;
    mockImplementation(fn?: T): this;
    mockReturnValue(value: ReturnType<T>): this;
    mockResolvedValue(value: Awaited<ReturnType<T>>): this;
    mockRejectedValue(value: any): this;
    mockRestore(): void;
    mockClear(): void;
    mockReset(): void;
    getMockName(): string;
    mock: {
      calls: Parameters<T>[];
      results: Array<{
        type: 'return' | 'throw';
        value: ReturnType<T>;
      }>;
      instances: any[];
    };
  }

  namespace jest {
    type MockedFunction<T extends (...args: any[]) => any> = MockedFunction<T>;
    
    interface SpyInstance<TReturn = any, TArgs extends any[] = any[]> {
      mockImplementation(fn?: (...args: TArgs) => TReturn): this;
      mockReturnValue(value: TReturn): this;
      mockResolvedValue(value: Awaited<TReturn>): this;
      mockRejectedValue(value: any): this;
      mockRestore(): void;
      mockClear(): void;
      mockReset(): void;
      getMockName(): string;
      mock: {
        calls: TArgs[];
        results: Array<{
          type: 'return' | 'throw';
          value: TReturn;
        }>;
        instances: any[];
      };
    }
    
    interface Mock<T = any, Y extends any[] = any[]> extends Function, MockInstance<T, Y> {
      new (...args: Y): T;
      (...args: Y): T;
    }
    
    interface MockInstance<T, Y extends any[]> {
      mockClear(): this;
      mockReset(): this;
      mockRestore(): void;
      mockImplementation(fn?: (...args: Y) => T): this;
      mockImplementationOnce(fn: (...args: Y) => T): this;
      mockName(name: string): this;
      mockReturnThis(): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
      mockResolvedValue(value: Awaited<T>): this;
      mockResolvedValueOnce(value: Awaited<T>): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
      getMockName(): string;
      mock: MockContext<T, Y>;
    }
    
    interface MockContext<T, Y extends any[]> {
      calls: Y[];
      instances: T[];
      invocationCallOrder: number[];
      results: Array<{
        type: 'return' | 'throw' | 'incomplete';
        value: T;
      }>;
    }
  }

  // Test functions
  var describe: (name: string, fn: () => void) => void;
  var it: (name: string, fn: () => void | Promise<void>) => void;
  var test: (name: string, fn: () => void | Promise<void>) => void;
  var expect: (value: any) => any;
  var beforeAll: (fn: () => void | Promise<void>) => void;
  var beforeEach: (fn: () => void | Promise<void>) => void;
  var afterAll: (fn: () => void | Promise<void>) => void;
  var afterEach: (fn: () => void | Promise<void>) => void;
}

// Module declarations for testing libraries
declare module '@testing-library/jest-dom' {
  interface CustomMatchers<R = unknown> {
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeEmpty(): R;
    toBeEmptyDOMElement(): R;
    toBeInTheDocument(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toBeVisible(): R;
    toContainElement(element: HTMLElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveAccessibleDescription(expectedAccessibleDescription?: string | RegExp): R;
    toHaveAccessibleName(expectedAccessibleName?: string | RegExp): R;
    toHaveAttribute(attr: string, value?: any): R;
    toHaveClass(...classNames: string[]): R;
    toHaveFocus(): R;
    toHaveFormValues(expectedValues: Record<string, any>): R;
    toHaveStyle(css: string | Record<string, any>): R;
    toHaveTextContent(text: string | RegExp): R;
    toHaveValue(value: string | string[] | number): R;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
    toBeChecked(): R;
    toBePartiallyChecked(): R;
    toHaveErrorMessage(text: string | RegExp): R;
  }
}

// Extend Jest matchers
declare namespace jest {
  interface Matchers<R> extends import('@testing-library/jest-dom').CustomMatchers<R> {}
}

// Performance API types
interface PerformanceLongTaskTiming extends PerformanceEntry {
  attribution: TaskAttributionTiming[];
}

interface TaskAttributionTiming {
  containerType: string;
  containerSrc: string;
  containerId: string;
  containerName: string;
}

// Web Vitals types
declare module 'web-vitals' {
  export interface Metric {
    name: string;
    value: number;
    delta: number;
    id: string;
    entries: PerformanceEntry[];
  }

  export type ReportHandler = (metric: Metric) => void;

  export function getCLS(onReport: ReportHandler): void;
  export function getFID(onReport: ReportHandler): void;
  export function getFCP(onReport: ReportHandler): void;
  export function getLCP(onReport: ReportHandler): void;
  export function getTTFB(onReport: ReportHandler): void;
}

// Mock types for testing
export interface MockProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  images: string[];
  amenities: string[];
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  };
  createdAt: string;
}

export interface MockSearchFilters {
  query: string;
  location: string;
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string;
  amenities: string[];
  sortBy: string;
  sortOrder: string;
}

export interface MockApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MockError {
  success: false;
  error: {
    message: string;
    code: number;
    details: Record<string, any>;
  };
}

// Test utility types
export interface TestProviderProps {
  children: React.ReactNode;
  queryClient?: any;
  theme?: string;
}

export interface CustomRenderOptions {
  queryClient?: any;
  theme?: string;
  user?: any;
}

export interface CustomRenderHookOptions<TProps> {
  queryClient?: any;
  theme?: string;
  initialProps?: TProps;
}

// Performance testing types
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
}

export interface AccessibilityTestOptions {
  axeOptions?: any;
  timeout?: number;
}

// Export everything
export {};
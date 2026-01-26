'use client'

// Cache configuration and utilities
export interface CacheConfig {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of items
  staleWhileRevalidate?: boolean
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
}

// In-memory cache implementation
export class MemoryCache {
  private cache = new Map<string, { value: any; expires: number; lastAccessed: number }>()
  private config: Required<CacheConfig>

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: config.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: config.maxSize || 100,
      staleWhileRevalidate: config.staleWhileRevalidate ?? true,
      serialize: config.serialize || JSON.stringify,
      deserialize: config.deserialize || JSON.parse,
    }
  }

  set(key: string, value: any, ttl?: number): void {
    const expires = Date.now() + (ttl || this.config.ttl)
    const lastAccessed = Date.now()

    // Remove oldest items if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, { value, expires, lastAccessed })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    
    // Update last accessed time
    item.lastAccessed = now

    // Check if expired
    if (now > item.expires) {
      if (!this.config.staleWhileRevalidate) {
        this.cache.delete(key)
        return null
      }
      // Return stale data but mark for revalidation
      return { value: item.value, stale: true }
    }

    return { value: item.value, stale: false }
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() > item.expires && !this.config.staleWhileRevalidate) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0

    for (const item of this.cache.values()) {
      if (now > item.expires) {
        expired++
      } else {
        valid++
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      hitRate: valid / (valid + expired) || 0,
    }
  }
}

// Local storage cache with compression
export class LocalStorageCache {
  protected prefix: string
  protected config: Required<CacheConfig>

  constructor(prefix = 'amarplot_cache', config: CacheConfig = {}) {
    this.prefix = prefix
    this.config = {
      ttl: config.ttl || 24 * 60 * 60 * 1000, // 24 hours default
      maxSize: config.maxSize || 50,
      staleWhileRevalidate: config.staleWhileRevalidate ?? true,
      serialize: config.serialize || JSON.stringify,
      deserialize: config.deserialize || JSON.parse,
    }
  }

  protected getKey(key: string): string {
    return `${this.prefix}_${key}`
  }

  protected isAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined'
    } catch {
      return false
    }
  }

  set(key: string, value: any, ttl?: number): void {
    if (!this.isAvailable()) return

    try {
      const expires = Date.now() + (ttl || this.config.ttl)
      const item = {
        value,
        expires,
        timestamp: Date.now(),
      }

      const serialized = this.config.serialize(item)
      localStorage.setItem(this.getKey(key), serialized)

      // Clean up old items if needed
      this.cleanup()
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error)
    }
  }

  get(key: string): any | null {
    if (!this.isAvailable()) return null

    try {
      const serialized = localStorage.getItem(this.getKey(key))
      if (!serialized) return null

      const item = this.config.deserialize(serialized)
      const now = Date.now()

      if (now > item.expires) {
        if (!this.config.staleWhileRevalidate) {
          localStorage.removeItem(this.getKey(key))
          return null
        }
        return { value: item.value, stale: true }
      }

      return { value: item.value, stale: false }
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error)
      return null
    }
  }

  has(key: string): boolean {
    if (!this.isAvailable()) return false

    try {
      const serialized = localStorage.getItem(this.getKey(key))
      if (!serialized) return false

      const item = this.config.deserialize(serialized)
      const now = Date.now()

      if (now > item.expires && !this.config.staleWhileRevalidate) {
        localStorage.removeItem(this.getKey(key))
        return false
      }

      return true
    } catch {
      return false
    }
  }

  delete(key: string): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch {
      return false
    }
  }

  clear(): void {
    if (!this.isAvailable()) return

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error)
    }
  }

  protected cleanup(): void {
    if (!this.isAvailable()) return

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      
      if (keys.length <= this.config.maxSize) return

      // Sort by timestamp and remove oldest
      const items = keys.map(key => {
        try {
          const item = this.config.deserialize(localStorage.getItem(key) || '')
          return { key, timestamp: item.timestamp || 0 }
        } catch {
          return { key, timestamp: 0 }
        }
      }).sort((a, b) => a.timestamp - b.timestamp)

      const toRemove = items.slice(0, keys.length - this.config.maxSize)
      toRemove.forEach(({ key }) => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to cleanup localStorage cache:', error)
    }
  }
}

// Session storage cache
export class SessionStorageCache extends LocalStorageCache {
  constructor(prefix = 'amarplot_session', config: CacheConfig = {}) {
    super(prefix, config)
  }

  protected isAvailable(): boolean {
    try {
      return typeof sessionStorage !== 'undefined'
    } catch {
      return false
    }
  }

  set(key: string, value: any, ttl?: number): void {
    if (!this.isAvailable()) return

    try {
      const expires = Date.now() + (ttl || this.config.ttl)
      const item = {
        value,
        expires,
        timestamp: Date.now(),
      }

      const serialized = this.config.serialize(item)
      sessionStorage.setItem(this.getKey(key), serialized)
    } catch (error) {
      console.warn('Failed to set sessionStorage cache:', error)
    }
  }

  get(key: string): any | null {
    if (!this.isAvailable()) return null

    try {
      const serialized = sessionStorage.getItem(this.getKey(key))
      if (!serialized) return null

      const item = this.config.deserialize(serialized)
      const now = Date.now()

      if (now > item.expires) {
        if (!this.config.staleWhileRevalidate) {
          sessionStorage.removeItem(this.getKey(key))
          return null
        }
        return { value: item.value, stale: true }
      }

      return { value: item.value, stale: false }
    } catch (error) {
      console.warn('Failed to get sessionStorage cache:', error)
      return null
    }
  }

  clear(): void {
    if (!this.isAvailable()) return

    try {
      const keys = Object.keys(sessionStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => sessionStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear sessionStorage cache:', error)
    }
  }
}

// Multi-layer cache manager
export class CacheManager {
  private memoryCache: MemoryCache
  private localStorageCache: LocalStorageCache
  private sessionStorageCache: SessionStorageCache

  constructor(config: {
    memory?: CacheConfig
    localStorage?: CacheConfig
    sessionStorage?: CacheConfig
  } = {}) {
    this.memoryCache = new MemoryCache(config.memory)
    this.localStorageCache = new LocalStorageCache('amarplot_cache', config.localStorage)
    this.sessionStorageCache = new SessionStorageCache('amarplot_session', config.sessionStorage)
  }

  // Get from cache with fallback strategy
  async get(key: string, layer: 'memory' | 'localStorage' | 'sessionStorage' | 'all' = 'all'): Promise<any | null> {
    if (layer === 'memory' || layer === 'all') {
      const memoryResult = this.memoryCache.get(key)
      if (memoryResult && !memoryResult.stale) {
        return memoryResult.value
      }
    }

    if (layer === 'localStorage' || layer === 'all') {
      const localResult = this.localStorageCache.get(key)
      if (localResult && !localResult.stale) {
        // Populate memory cache
        this.memoryCache.set(key, localResult.value)
        return localResult.value
      }
    }

    if (layer === 'sessionStorage' || layer === 'all') {
      const sessionResult = this.sessionStorageCache.get(key)
      if (sessionResult && !sessionResult.stale) {
        // Populate higher-level caches
        this.memoryCache.set(key, sessionResult.value)
        return sessionResult.value
      }
    }

    return null
  }

  // Set to all cache layers
  set(key: string, value: any, options: {
    memory?: { ttl?: number }
    localStorage?: { ttl?: number }
    sessionStorage?: { ttl?: number }
  } = {}): void {
    this.memoryCache.set(key, value, options.memory?.ttl)
    this.localStorageCache.set(key, value, options.localStorage?.ttl)
    this.sessionStorageCache.set(key, value, options.sessionStorage?.ttl)
  }

  // Delete from all cache layers
  delete(key: string): void {
    this.memoryCache.delete(key)
    this.localStorageCache.delete(key)
    this.sessionStorageCache.delete(key)
  }

  // Clear all caches
  clear(): void {
    this.memoryCache.clear()
    this.localStorageCache.clear()
    this.sessionStorageCache.clear()
  }

  // Get cache statistics
  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      localStorage: {
        size: 0, // Would need to implement a keys() method
      },
      sessionStorage: {
        size: 0, // Would need to implement a keys() method
      },
    }
  }
}

// Cache decorators and utilities
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    cache?: MemoryCache
    keyGenerator?: (...args: Parameters<T>) => string
    ttl?: number
  } = {}
): T {
  const cache = options.cache || new MemoryCache({ ttl: options.ttl })
  const keyGenerator = options.keyGenerator || ((...args) => JSON.stringify(args))

  return ((...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    const cached = cache.get(key)
    
    if (cached && !cached.stale) {
      return cached.value
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Cache invalidation utilities
export class CacheInvalidator {
  private static instance: CacheInvalidator
  private patterns = new Map<string, Set<string>>()

  static getInstance(): CacheInvalidator {
    if (!CacheInvalidator.instance) {
      CacheInvalidator.instance = new CacheInvalidator()
    }
    return CacheInvalidator.instance
  }

  // Register cache keys with patterns for invalidation
  register(pattern: string, key: string): void {
    if (!this.patterns.has(pattern)) {
      this.patterns.set(pattern, new Set())
    }
    this.patterns.get(pattern)!.add(key)
  }

  // Invalidate caches by pattern
  invalidate(pattern: string, cacheManager: CacheManager): void {
    const keys = this.patterns.get(pattern)
    if (keys) {
      keys.forEach(key => cacheManager.delete(key))
    }
  }

  // Invalidate all caches matching a regex pattern
  invalidateByRegex(regex: RegExp, cacheManager: CacheManager): void {
    for (const [pattern, keys] of this.patterns.entries()) {
      if (regex.test(pattern)) {
        keys.forEach(key => cacheManager.delete(key))
      }
    }
  }
}

// Global cache instances
export const globalCache = new CacheManager({
  memory: { ttl: 5 * 60 * 1000, maxSize: 100 }, // 5 minutes, 100 items
  localStorage: { ttl: 24 * 60 * 60 * 1000, maxSize: 50 }, // 24 hours, 50 items
  sessionStorage: { ttl: 60 * 60 * 1000, maxSize: 25 }, // 1 hour, 25 items
})

export const cacheInvalidator = CacheInvalidator.getInstance()
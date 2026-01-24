/**
 * Simple in-memory cache for frequently accessed, rarely changing data
 * This reduces database queries for static data like categories and settings
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class SimpleCache {
    private cache: Map<string, CacheEntry<any>> = new Map();

    set<T>(key: string, data: T, ttlMinutes: number = 5): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMinutes * 60 * 1000,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if cache entry has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Invalidate cache entries matching a pattern
    invalidatePattern(pattern: string): void {
        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        });
    }
}

// Export a singleton instance
export const cache = new SimpleCache();

// Cache keys constants for consistency
export const CACHE_KEYS = {
    CATEGORIES: 'categories:all',
    SITE_SETTINGS: 'settings:site',
    ACTIVE_PROMOTIONS: 'promotions:active',
    FEATURED_PRODUCTS: 'products:featured',
    NEW_ARRIVALS: 'products:new',
} as const;

/**
 * Performance Monitoring and Optimization Utilities
 */

/**
 * Measure and log Core Web Vitals
 */
export function measureWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1] as any;
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        clsScore += (entry as any).value;
                        console.log('CLS:', clsScore);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.error('Error measuring web vitals:', e);
        }
    }
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Request Idle Callback wrapper with fallback
 */
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }) {
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, options);
    } else {
        setTimeout(callback, 1);
    }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;
    document.head.appendChild(link);
}

/**
 * Prefetch next page
 */
export function prefetchPage(href: string) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
    if (typeof window === 'undefined') return false;

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get page load metrics
 */
export function getPageLoadMetrics() {
    if (typeof window === 'undefined' || !window.performance) return null;

    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    return {
        pageLoadTime,
        connectTime,
        renderTime,
        domInteractive: perfData.domInteractive - perfData.navigationStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
    };
}

/**
 * Log performance metrics in development
 */
export function logPerformance() {
    if (process.env.NODE_ENV !== 'development') return;

    const metrics = getPageLoadMetrics();
    if (metrics) {
        console.table(metrics);
    }

    measureWebVitals();
}

/**
 * Optimize font loading
 */
export function optimizeFonts() {
    if (typeof document === 'undefined') return;

    // Use font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
    @font-face {
      font-display: swap;
    }
  `;
    document.head.appendChild(style);
}

/**
 * Detect if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get device memory (if available)
 */
export function getDeviceMemory(): number | undefined {
    if (typeof navigator === 'undefined') return undefined;

    return (navigator as any).deviceMemory;
}

/**
 * Check if device is low-end
 */
export function isLowEndDevice(): boolean {
    const memory = getDeviceMemory();

    // Device with less than 4GB RAM is considered low-end
    if (memory && memory < 4) return true;

    // Check hardware concurrency (number of logical processors)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;

    return false;
}

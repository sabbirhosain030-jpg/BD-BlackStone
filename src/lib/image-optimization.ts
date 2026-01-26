/**
 * Image Optimization Utilities
 * Functions to optimize images for performance
 */

/**
 * Generate optimized Cloudinary URL
 */
export function optimizeCloudinaryImage(
    url: string,
    options: {
        width?: number;
        height?: number;
        quality?: number | 'auto';
        format?: 'auto' | 'webp' | 'jpg' | 'png';
        dpr?: number;
    } = {}
): string {
    if (!url || !url.includes('cloudinary')) return url;

    const {
        width,
        height,
        quality = 'auto',
        format = 'auto',
        dpr = 1,
    } = options;

    // Build transformation parameters
    const transformations = [];

    if (format) transformations.push(`f_${format}`);
    if (quality) transformations.push(`q_${quality}`);
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (dpr > 1) transformations.push(`dpr_${dpr}`);

    // Add smart cropping
    transformations.push('c_fill');
    transformations.push('g_auto');

    const transformString = transformations.join(',');

    // Insert transformations into Cloudinary URL
    return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Get responsive srcset for images
 */
export function getResponsiveSrcSet(
    url: string,
    sizes: number[] = [320, 640, 960, 1280, 1920]
): string {
    return sizes
        .map(size => {
            const optimizedUrl = optimizeCloudinaryImage(url, { width: size });
            return `${optimizedUrl} ${size}w`;
        })
        .join(', ');
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1"/>
      </filter>
      <rect width="${width}" height="${height}" fill="#f0f0f0" filter="url(#b)"/>
    </svg>
  `;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Get image dimensions from Cloudinary URL or estimate
 */
export function getImageDimensions(url: string): { width: number; height: number } {
    // Try to extract dimensions from URL
    const match = url.match(/w_(\d+).*h_(\d+)/);

    if (match) {
        return {
            width: parseInt(match[1], 10),
            height: parseInt(match[2], 10),
        };
    }

    // Default aspect ratio 4:5 for products
    return { width: 800, height: 1000 };
}

/**
 * Preload critical images
 */
export function preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
    });
}

/**
 * Lazy load images with Intersection Observer
 */
export function setupLazyLoading(selector: string = '[data-lazy]') {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                const src = img.dataset.lazy;

                if (src) {
                    img.src = src;
                    img.removeAttribute('data-lazy');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px', // Start loading 50px before entering viewport
    });

    document.querySelectorAll(selector).forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Get optimal image quality based on device and network
 */
export function getOptimalQuality(
    isRetina: boolean = false,
    isSlowNetwork: boolean = false
): number {
    if (isSlowNetwork) return 60;
    if (isRetina) return 85;
    return 75;
}

/**
 * Convert image format based on browser support
 */
export function getBestImageFormat(): 'webp' | 'avif' | 'jpg' {
    if (typeof window === 'undefined') return 'jpg';

    // Check for AVIF support
    const avifSupport = document.createElement('canvas')
        .toDataURL('image/avif')
        .indexOf('data:image/avif') === 0;

    if (avifSupport) return 'avif';

    // Check for WebP support
    const webpSupport = document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;

    if (webpSupport) return 'webp';

    return 'jpg';
}

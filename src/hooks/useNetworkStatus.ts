import { useState, useEffect } from 'react';

export interface NetworkInfo {
    isOnline: boolean;
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
    downlink?: number; // Mbps
    rtt?: number; // Round trip time in ms
    saveData: boolean; // User has enabled data saver mode
    isSlowConnection: boolean;
}

/**
 * Custom hook to monitor network status
 * Useful for adaptive image loading and content delivery
 */
export function useNetworkStatus(): NetworkInfo {
    const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
        isOnline: true,
        effectiveType: 'unknown',
        saveData: false,
        isSlowConnection: false,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateNetworkInfo = () => {
            const connection = (navigator as any).connection ||
                (navigator as any).mozConnection ||
                (navigator as any).webkitConnection;

            const effectiveType = connection?.effectiveType || 'unknown';
            const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g';

            setNetworkInfo({
                isOnline: navigator.onLine,
                effectiveType,
                downlink: connection?.downlink,
                rtt: connection?.rtt,
                saveData: connection?.saveData || false,
                isSlowConnection,
            });
        };

        // Initial check
        updateNetworkInfo();

        // Listen for online/offline events
        window.addEventListener('online', updateNetworkInfo);
        window.addEventListener('offline', updateNetworkInfo);

        // Listen for connection changes
        const connection = (navigator as any).connection;
        if (connection) {
            connection.addEventListener('change', updateNetworkInfo);
        }

        return () => {
            window.removeEventListener('online', updateNetworkInfo);
            window.removeEventListener('offline', updateNetworkInfo);
            if (connection) {
                connection.removeEventListener('change', updateNetworkInfo);
            }
        };
    }, []);

    return networkInfo;
}

/**
 * Hook to determine if images should be optimized for slow connections
 */
export function useOptimizeForNetwork() {
    const network = useNetworkStatus();

    return {
        shouldOptimize: network.isSlowConnection || network.saveData,
        imageQuality: network.isSlowConnection ? 60 : 90,
        shouldLazyLoad: !network.isSlowConnection,
    };
}

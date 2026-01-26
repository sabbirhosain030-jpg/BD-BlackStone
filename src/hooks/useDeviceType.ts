import { useState, useEffect } from 'react';

export interface DeviceInfo {
    isTouchDevice: boolean;
    isDesktop: boolean;
    isTablet: boolean;
    isMobile: boolean;
    screenWidth: number;
    screenHeight: number;
}

/**
 * Custom hook to detect device type and capabilities
 * Provides responsive device information
 */
export function useDeviceType(): DeviceInfo {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        isTouchDevice: false,
        isDesktop: false,
        isTablet: false,
        isMobile: false,
        screenWidth: 0,
        screenHeight: 0,
    });

    useEffect(() => {
        const updateDeviceInfo = () => {
            if (typeof window === 'undefined') return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            setDeviceInfo({
                isTouchDevice,
                isDesktop: width >= 1024,
                isTablet: width >= 768 && width < 1024,
                isMobile: width < 768,
                screenWidth: width,
                screenHeight: height,
            });
        };

        // Initial check
        updateDeviceInfo();

        // Listen for resize
        window.addEventListener('resize', updateDeviceInfo);

        return () => {
            window.removeEventListener('resize', updateDeviceInfo);
        };
    }, []);

    return deviceInfo;
}

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect screen orientation
 * Returns 'portrait' or 'landscape'
 */
export function useOrientation() {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

    useEffect(() => {
        const handleOrientationChange = () => {
            if (typeof window !== 'undefined') {
                const isPortrait = window.innerHeight > window.innerWidth;
                setOrientation(isPortrait ? 'portrait' : 'landscape');
            }
        };

        // Initial check
        handleOrientationChange();

        // Listen for resize events
        window.addEventListener('resize', handleOrientationChange);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    return orientation;
}

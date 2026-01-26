'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Page Transition Component with Loading State
 * Shows a loading bar during page transitions
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return (
        <>
            {children}
        </>
    );
}

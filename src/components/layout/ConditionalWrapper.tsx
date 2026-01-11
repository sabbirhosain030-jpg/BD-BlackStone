'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface ConditionalWrapperProps {
    children: React.ReactNode;
    hideOnPaths?: string[];
}

export const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
    children,
    hideOnPaths = ['/admin']
}) => {
    const pathname = usePathname();

    // Check if current path starts with any of the restricted paths
    const shouldHide = hideOnPaths.some(path => pathname?.startsWith(path));

    if (shouldHide) return null;

    return <>{children}</>;
};

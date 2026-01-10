'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-stone-900 text-stone-100">
            <h2 className="text-2xl font-bold mb-4 text-[#d4af37]">Something went wrong!</h2>
            <p className="mb-6 text-stone-400 max-w-md">
                We apologize for the inconvenience. This might be a temporary issue. Please try again.
            </p>
            {error.digest && (
                <p className="mb-4 text-xs text-stone-600 font-mono">
                    Error ID: {error.digest}
                </p>
            )}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-stone-800 rounded-md max-w-2xl text-left">
                    <p className="text-xs text-red-400 font-mono break-words">
                        {error.message}
                    </p>
                </div>
            )}
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-[#d4af37] text-stone-900 rounded-md font-semibold hover:bg-[#c5a028] transition-colors"
                >
                    Try again
                </button>
                <Link href="/">
                    <button className="px-6 py-2 bg-stone-700 text-stone-100 rounded-md font-semibold hover:bg-stone-600 transition-colors">
                        Go Home
                    </button>
                </Link>
            </div>
            <p className="mt-8 text-xs text-stone-500 max-w-md">
                If this problem persists, please contact support or check that all services are properly configured.
            </p>
        </div>
    );
}

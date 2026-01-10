'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-stone-900 text-stone-100">
            <h2 className="text-2xl font-bold mb-4 text-[#d4af37]">Something went wrong!</h2>
            <p className="mb-6 text-stone-400">
                We apologize for the inconvenience. Please try again later.
            </p>
            {error.digest && (
                <p className="mb-4 text-xs text-stone-600 font-mono">
                    Error ID: {error.digest}
                </p>
            )}
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-6 py-2 bg-[#d4af37] text-stone-900 rounded-md font-semibold hover:bg-[#c5a028] transition-colors"
            >
                Try again
            </button>
        </div>
    );
}

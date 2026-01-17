'use client';

import { useState } from 'react';

interface DownloadReceiptButtonProps {
    order: any;
}

export function DownloadReceiptButton({ order }: DownloadReceiptButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const { generateReceipt } = await import('@/lib/receipt-pdf');
            generateReceipt(order);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF receipt');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="stone-btn stone-btn-primary"
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                fontSize: '0.95rem'
            }}
        >
            {isGenerating ? (
                <span>Generating PDF...</span>
            ) : (
                <>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF</span>
                </>
            )}
        </button>
    );
}

'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

// A separate fallback component for Suspense
function SuccessFallback() {
    return <div>Loading order details...</div>;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: '600px' }}>
            <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--color-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                color: 'var(--color-charcoal)'
            }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
            </div>

            <h1 style={{
                color: 'var(--color-gold)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-heading)'
            }}>Order Placed Successfully!</h1>

            <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Thank you for your purchase. Your order has been received and is being processed.
                We will contact you shortly to confirm the delivery details.
            </p>

            {orderId && (
                <div style={{
                    background: '#1a1a1a',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    border: '1px solid #333'
                }}>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.9rem' }}>Order Reference ID</span>
                    <span style={{ color: 'white', fontSize: '1.2rem', fontFamily: 'monospace' }}>{orderId}</span>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/products">
                    <Button variant="primary">Continue Shopping</Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<SuccessFallback />}>
            <SuccessContent />
        </Suspense>
    );
}

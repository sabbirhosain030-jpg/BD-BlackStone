'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getOrderWithWhatsAppLink } from './actions';
import * as fpixel from '@/lib/fpixel';

// A separate fallback component for Suspense
function SuccessFallback() {
    return (
        <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div>Loading order details...</div>
        </div>
    );
}

import Receipt from '@/components/checkout/Receipt';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            getOrderWithWhatsAppLink(orderId).then(result => {
                if (result.success) {
                    setWhatsappLink(result.whatsappLink || null);
                    setOrderData(result.order);

                    // 🔵 FB Pixel: Purchase — fires once order is confirmed
                    if (result.order) {
                        fpixel.purchase({
                            orderId: orderId,
                            value: result.order.total ?? 0,
                            numItems: result.order.items?.length ?? 1,
                        });
                    }
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [orderId]);


    // Simple Confetti Animation CSS
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes popScale {
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes rainbow {
                0% { color: var(--color-gold); }
                50% { color: #ff6b6b; }
                100% { color: var(--color-gold); }
            }
            .congrats-text {
                animation: popScale 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, rainbow 3s infinite linear;
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    if (loading) return <SuccessFallback />;

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
                color: 'var(--color-charcoal)',
                animation: 'popScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
            }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
            </div>

            <h1 className="congrats-text" style={{
                marginBottom: '1rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem'
            }}>Congratulations!</h1>

            <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Your order has been placed successfully.
            </p>

            {/* Receipt Component */}
            {orderData && (
                <div style={{ marginBottom: '3rem' }}>
                    <Receipt order={orderData} />
                </div>
            )}

            {whatsappLink && (
                <div style={{ marginBottom: '2rem' }}>
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#25D366',
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <span>📱</span> Send Order to WhatsApp
                    </a>
                </div>
            )}


            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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

'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getOrderWithWhatsAppLink } from './actions';

// A separate fallback component for Suspense
function SuccessFallback() {
    return (
        <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div>Loading order details...</div>
        </div>
    );
}

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
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [orderId]);

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

            {orderData && (
                <div style={{
                    background: '#1a1a1a',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    border: '1px solid #333'
                }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ color: '#888', display: 'block', fontSize: '0.9rem' }}>Order Number</span>
                        <span style={{ color: 'white', fontSize: '1.4rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {orderData.orderNumber}
                        </span>
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                        <span style={{ color: '#888', display: 'block', fontSize: '0.9rem' }}>Total Amount</span>
                        <span style={{ color: 'var(--color-gold)', fontSize: '1.6rem', fontWeight: 'bold' }}>
                            ৳{orderData.total.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}

            {whatsappLink && (
                <div style={{ marginBottom: '2rem' }}>
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            background: '#25D366',
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        📱 Send Order to WhatsApp
                    </a>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Get instant confirmation on WhatsApp
                    </p>
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

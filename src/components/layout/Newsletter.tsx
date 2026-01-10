'use client';

import React, { useState } from 'react';

export const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            console.log("Subscribed:", email);
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <div className="newsletter-section" style={{ marginTop: '2rem' }}>
            <h3 style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                marginBottom: '1rem',
                textTransform: 'uppercase'
            }}>
                Subscribe to our Newsletter
            </h3>
            <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Be the first to know about new arrivals, lookbooks, and exclusive offers.
            </p>

            {status === 'success' ? (
                <div style={{ color: '#4caf50', padding: '1rem', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '4px' }}>
                    Thank you for subscribing!
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid #333',
                            color: 'white',
                            borderRadius: '4px'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn"
                        style={{
                            background: 'var(--color-gold)',
                            color: 'var(--color-charcoal)',
                            fontWeight: 600,
                            border: 'none',
                            padding: '0 1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        {status === 'loading' ? '...' : 'Subscribe'}
                    </button>
                </form>
            )}
        </div>
    );
};

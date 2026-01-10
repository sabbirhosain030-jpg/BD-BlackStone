'use client';

import React from 'react';

export const OfferMarquee = () => {
    return (
        <div style={{
            background: 'var(--color-charcoal)',
            color: 'var(--color-white)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            padding: '8px 0',
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            position: 'relative',
            zIndex: 40
        }}>
            <div style={{
                display: 'inline-block',
                animation: 'marquee 20s linear infinite',
                paddingLeft: '100%'
            }}>
                <span style={{ marginRight: '50px' }}>FREE SHIPPING ON ORDERS OVER 5000 BDT</span>
                <span style={{ marginRight: '50px' }}>NEW ARRIVALS: DISCOVER THE 2026 COLLECTION</span>
                <span style={{ marginRight: '50px' }}>USE CODE: GV15 FOR 15% OFF</span>
                <span style={{ marginRight: '50px' }}>LIMITED TIME OFFER: BUY 2 GET 10% OFF</span>
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(-100%, 0); }
                }
            `}</style>
        </div>
    );
};

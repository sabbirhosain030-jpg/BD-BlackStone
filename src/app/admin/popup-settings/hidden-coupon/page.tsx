'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../admin.css';

export default function HiddenCouponSettings() {
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch('/api/popup-settings');
            const data = await response.json();
            setCouponCode(data.hiddenCouponCode || '');
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/popup-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hiddenCouponCode: couponCode || null })
            });

            if (response.ok) {
                alert('Hidden coupon saved successfully!');
            } else {
                alert('Failed to save coupon');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save coupon');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ color: 'var(--color-white)', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="hidden-coupon-settings">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">🔒 Hidden Coupon Code</h1>
                    <p style={{ color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                        Set a secret coupon code that is only revealed after subscription
                    </p>
                </div>
                <Link href="/admin/popup-settings">
                    <button className="btn btn-secondary">← Back to Dashboard</button>
                </Link>
            </div>

            <div className="stone-card" style={{ maxWidth: '600px', marginTop: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Hidden Coupon Code</label>
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="form-input"
                            placeholder="e.g., SECRET25"
                            style={{ textTransform: 'uppercase', fontSize: '1.25rem', fontWeight: 600 }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                            This code will only be shown to users who subscribe to the newsletter
                        </p>
                    </div>

                    {couponCode && (
                        <div style={{
                            background: 'var(--color-stone-dark)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '2px dashed var(--color-stone-border)',
                            marginBottom: '1.5rem',
                            opacity: 0.8
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)', marginBottom: '0.5rem' }}>
                                PREVIEW (Revealed after subscription)
                            </div>
                            <div style={{ fontSize: '2rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em' }}>
                                {couponCode}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="admin-btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Hidden Coupon'}
                    </button>
                </form>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../admin.css';

export default function PublicCouponSettings() {
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
            setCouponCode(data.publicCouponCode || '');
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
                body: JSON.stringify({ publicCouponCode: couponCode || null })
            });

            if (response.ok) {
                alert('Public coupon saved successfully!');
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
        <div className="public-coupon-settings">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">🎟️ Public Coupon Code</h1>
                    <p style={{ color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                        Set the publicly visible coupon code shown in the popup
                    </p>
                </div>
                <Link href="/admin/popup-settings">
                    <button className="btn btn-secondary">← Back to Dashboard</button>
                </Link>
            </div>

            <div className="stone-card" style={{ maxWidth: '600px', marginTop: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Public Coupon Code</label>
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="form-input"
                            placeholder="e.g., SAVE20"
                            style={{ textTransform: 'uppercase', fontSize: '1.25rem', fontWeight: 600 }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                            This coupon code will be displayed to all visitors in the popup
                        </p>
                    </div>

                    {couponCode && (
                        <div style={{
                            background: 'var(--color-stone-dark)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '2px dashed var(--color-gold)',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                PREVIEW
                            </div>
                            <div style={{ fontSize: '2rem', color: 'var(--color-white)', fontWeight: 700, letterSpacing: '0.1em' }}>
                                {couponCode}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="admin-btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Public Coupon'}
                    </button>
                </form>
            </div>
        </div>
    );
}

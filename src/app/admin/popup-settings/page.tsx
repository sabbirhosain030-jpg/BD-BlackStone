'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../admin.css';

type PopupSettings = {
    id?: string;
    isEnabled: boolean;
    title: string;
    message: string;
    publicCouponCode: string | null;
    hiddenCouponCode: string | null;
    offerEndTime: string | null;
    showCountdown: boolean;
    countdownText: string | null;
};

export default function PopupSettingsDashboard() {
    const [settings, setSettings] = useState<PopupSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch('/api/popup-settings');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div style={{ color: 'var(--color-white)' }}>Loading...</div>
            </div>
        );
    }

    const features = [
        {
            title: 'Popup Display',
            description: 'Enable/disable popup and customize title & message',
            icon: '🎯',
            href: '/admin/popup-settings/display',
            status: settings?.isEnabled ? 'Active' : 'Inactive'
        },
        {
            title: 'Public Coupon',
            description: 'Manage publicly visible coupon code',
            icon: '🎟️',
            href: '/admin/popup-settings/public-coupon',
            status: settings?.publicCouponCode ? 'Set' : 'Not Set'
        },
        {
            title: 'Hidden Coupon',
            description: 'Manage hidden coupon code for special offers',
            icon: '🔒',
            href: '/admin/popup-settings/hidden-coupon',
            status: settings?.hiddenCouponCode ? 'Set' : 'Not Set'
        },
        {
            title: 'Countdown Timer',
            description: 'Configure countdown timer and offer end date',
            icon: '⏱️',
            href: '/admin/popup-settings/countdown',
            status: settings?.showCountdown ? 'Active' : 'Inactive'
        }
    ];

    return (
        <div className="popup-settings-dashboard">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">🎨 Popup Settings</h1>
                    <p style={{ color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                        Manage your marketing popup features individually
                    </p>
                </div>
            </div>

            <div className="features-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
            }}>
                {features.map((feature) => (
                    <Link key={feature.href} href={feature.href} style={{ textDecoration: 'none' }}>
                        <div className="stone-card" style={{
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: '1px solid var(--color-stone-border)',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                {feature.icon}
                            </div>

                            <h3 style={{
                                color: 'var(--color-white)',
                                fontSize: '1.25rem',
                                marginBottom: '0.5rem'
                            }}>
                                {feature.title}
                            </h3>

                            <p style={{
                                color: 'var(--color-stone-text)',
                                fontSize: '0.875rem',
                                marginBottom: '1rem',
                                lineHeight: '1.5'
                            }}>
                                {feature.description}
                            </p>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginTop: 'auto',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--color-stone-border)'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-stone-text)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Status:
                                </span>
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: feature.status.includes('Active') || feature.status.includes('Set')
                                        ? 'var(--color-success)'
                                        : 'var(--color-stone-text)',
                                    fontWeight: 500
                                }}>
                                    {feature.status}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style>{`
                .stone-card:hover {
                    transform: translateY(-2px);
                    border-color: var(--color-gold) !important;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}

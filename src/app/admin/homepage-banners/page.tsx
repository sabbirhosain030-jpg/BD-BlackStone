import React from 'react';
import { getAllHomepageBanners } from '../actions';
import Link from 'next/link';
import '../admin.css';

export const revalidate = 0;

export default async function HomepageBannersPage() {
    const banners = await getAllHomepageBanners();

    return (
        <div className="admin-content">
            <div className="admin-header">
                <div>
                    <h1>Homepage Banners</h1>
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-stone-text)' }}>
                        {banners.length} banner{banners.length !== 1 ? 's' : ''} • Manage homepage hero sections
                    </p>
                </div>
                <Link
                    href="/admin/homepage-banners/add"
                    className="admin-btn-primary"
                    style={{ width: 'auto', padding: '0.75rem 1.5rem', textDecoration: 'none' }}
                >
                    + Add Banner
                </Link>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {banners.length > 0 ? (
                    banners.map((banner: any) => (
                        <div key={banner.id} className="stone-card">
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                {/* Banner Image Preview */}
                                <div style={{
                                    width: '200px',
                                    height: '120px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: '#f0f0f0',
                                    flexShrink: 0
                                }}>
                                    {banner.imageUrl ? (
                                        <img
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#999'
                                        }}>
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Banner Details */}
                                <div style{{ flex: 1, minWidth: '250px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', color: 'var(--color-white)', margin: 0 }}>
                                            {banner.title}
                                        </h3>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: banner.isActive ?
                                                'rgba(16, 185, 129, 0.2)' :
                                                'rgba(156, 163, 175, 0.2)',
                                            color: banner.isActive ? '#10b981' : '#9ca3af'
                                        }}>
                                            {banner.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: 'rgba(212, 175, 55, 0.2)',
                                            color: 'var(--color-gold)'
                                        }}>
                                            Priority: {banner.priority}
                                        </span>
                                    </div>

                                    {banner.overlayText && (
                                        <p style={{ color: 'var(--color-stone-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                            {banner.overlayText.substring(0, 100)}{banner.overlayText.length > 100 ? '...' : ''}
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--color-stone-text)' }}>
                                        {banner.startDate && (
                                            <span>Start: {new Date(banner.startDate).toLocaleDateString()}</span>
                                        )}
                                        {banner.endDate && (
                                            <span>End: {new Date(banner.endDate).toLocaleDateString()}</span>
                                        )}
                                        {banner.buttonText && (
                                            <span>Button: "{banner.buttonText}"</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Link
                                        href={`/admin/homepage-banners/${banner.id}`}
                                        className="admin-icon-btn"
                                        title="Edit"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        const { deleteHomepageBanner } = await import('../actions');
                                        await deleteHomepageBanner(banner.id);
                                    }}>
                                        <button
                                            type="submit"
                                            className="admin-icon-btn"
                                            style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                                            title="Delete"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="stone-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-stone-text)"
                            strokeWidth="1.5"
                            style={{ margin: '0 auto 1.5rem' }}
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                        </svg>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-white)' }}>
                            No Banners Yet
                        </h2>
                        <p style={{ color: 'var(--color-stone-text)', marginBottom: '1.5rem' }}>
                            Create your first homepage banner to get started
                        </p>
                        <Link
                            href="/admin/homepage-banners/add"
                            className="admin-btn-primary"
                            style={{
                                width: 'auto',
                                padding: '0.75rem 1.5rem',
                                display: 'inline-block',
                                textDecoration: 'none'
                            }}
                        >
                            + Add Banner
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

import React from 'react';
import { getMarketingBanners, createMarketingBanner, deleteMarketingBanner, toggleMarketingBanner } from '../actions';
import Image from 'next/image';

export default async function MarketingPage() {
    const banners = await getMarketingBanners();

    return (
        <div className="admin-page">
            <h1 className="admin-title">Marketing Management</h1>

            {/* Create New Banner Section */}
            <div className="stone-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-white)', marginBottom: '1rem' }}>Create New Offer Poster</h2>
                <form action={createMarketingBanner} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
                    <input type="hidden" name="type" value="POSTER" />

                    <div>
                        <label style={{ display: 'block', color: 'var(--color-stone-text)', marginBottom: '0.5rem' }}>Title (e.g. "Summer Sale")</label>
                        <input name="title" className="admin-input" required />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--color-stone-text)', marginBottom: '0.5rem' }}>Image URL (Upload to Cloudinary first)</label>
                        <input name="image" className="admin-input" required placeholder="https://res.cloudinary.com/..." />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--color-stone-text)', marginBottom: '0.5rem' }}>Description / Text</label>
                        <textarea name="text" className="admin-input" rows={3}></textarea>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" name="isActive" id="active" defaultChecked />
                        <label htmlFor="active" style={{ color: 'var(--color-white)' }}>Active Immediately</label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>Create Poster</button>
                </form>
            </div>

            {/* List Existing Banners */}
            <div className="stone-card">
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-white)', marginBottom: '1rem' }}>Active Posters</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {banners.map((banner) => (
                        <div key={banner.id} style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: banner.isActive ? '1px solid var(--color-gold)' : '1px solid #333'
                        }}>
                            <div style={{ position: 'relative', height: '200px' }}>
                                {banner.image ? (
                                    <Image src={banner.image} alt={banner.title || 'Banner'} fill style={{ objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>No Image</div>
                                )}
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{banner.title}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '1rem' }}>{banner.text}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <form action={async () => {
                                        'use server';
                                        await deleteMarketingBanner(banner.id);
                                    }}>
                                        <button style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                    </form>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: banner.isActive ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 68, 68, 0.2)',
                                        color: banner.isActive ? '#4caf50' : '#ff4444'
                                    }}>
                                        {banner.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && <p style={{ color: '#aaa' }}>No active marketing banners.</p>}
                </div>
            </div>
        </div>
    );
}

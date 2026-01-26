'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';
import '../../admin.css';

export default function AddHomepageBannerPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        // Convert form data to object
        const data = {
            title: formData.get('title') as string,
            overlayText: formData.get('overlayText') as string || null,
            buttonText: formData.get('buttonText') as string || null,
            buttonLink: formData.get('buttonLink') as string || null,
            imageUrl: imageUrl,
            priority: parseInt(formData.get('priority') as string) || 0,
            isActive: formData.get('isActive') === 'on',
            startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
            endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
        };

        try {
            const response = await fetch('/api/admin/homepage-banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/admin/homepage-banners');
                router.refresh();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Failed to create banner'}`);
            }
        } catch (error) {
            console.error('Error creating banner:', error);
            alert('Failed to create banner. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Add Homepage Banner</h1>
                <p style={{ marginTop: '0.5rem', color: 'var(--color-stone-text)' }}>
                    Create a new hero banner for your homepage
                </p>
            </div>

            <div className="stone-card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label className="form-label">Banner Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            required
                            placeholder="e.g. Summer Sale 2026"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Banner Image</label>
                        <ImageUpload
                            onUpload={(url) => setImageUrl(url)}
                            currentImageUrl={imageUrl}
                        />
                        {!imageUrl && (
                            <small style={{ color: 'var(--color-stone-text)', display: 'block', marginTop: '0.5rem' }}>
                                Upload a high-quality image (recommended: 1920x800px)
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Overlay Text (Optional)</label>
                        <textarea
                            name="overlayText"
                            className="form-input"
                            rows={3}
                            placeholder="Text to display over the banner image"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Button Text (Optional)</label>
                            <input
                                type="text"
                                name="buttonText"
                                className="form-input"
                                placeholder="e.g. Shop Now"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Button Link (Optional)</label>
                            <input
                                type="text"
                                name="buttonLink"
                                className="form-input"
                                placeholder="/products"
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Start Date (Optional)</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date (Optional)</label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <input
                            type="number"
                            name="priority"
                            className="form-input"
                            defaultValue={0}
                            placeholder="Higher priority banners show first"
                        />
                        <small style={{ color: 'var(--color-stone-text)', display: 'block', marginTop: '0.5rem' }}>
                            Higher numbers = higher priority
                        </small>
                    </div>

                    <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="isActive"
                                defaultChecked
                                style={{ width: '18px', height: '18px' }}
                            />
                            Active (Display banner immediately)
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn-primary"
                            disabled={isSubmitting || !imageUrl}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

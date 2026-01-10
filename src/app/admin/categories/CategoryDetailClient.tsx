'use client';

import React, { useState } from 'react';
import { createSubCategory, deleteSubCategory } from '../../actions';
import { useRouter } from 'next/navigation';

interface SubCategory {
    id: string;
    name: string;
    slug: string;
}

interface CategoryDetailProps {
    categoryId: string;
    categoryName: string;
    subCategories: SubCategory[];
}

export default function CategoryDetailClient({ categoryId, categoryName, subCategories }: CategoryDetailProps) {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleAdd(formData: FormData) {
        setIsLoading(true);
        const result = await createSubCategory(categoryId, formData);
        setIsLoading(false);
        if (result?.success) {
            setIsAdding(false);
            router.refresh(); // Refresh server data
        } else {
            alert('Failed to add subcategory');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure?')) return;
        const result = await deleteSubCategory(id);
        if (result?.success) {
            router.refresh();
        } else {
            alert('Failed to delete subcategory');
        }
    }

    return (
        <div className="stone-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-white)' }}>Subcategories for {categoryName}</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary"
                    style={{
                        background: 'var(--color-gold)',
                        color: 'var(--color-charcoal)',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    {isAdding ? 'Cancel' : '+ Add Subcategory'}
                </button>
            </div>

            {isAdding && (
                <form action={handleAdd} style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr auto' }}>
                        <input
                            name="name"
                            placeholder="Subcategory Name"
                            required
                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff' }}
                        />
                        <input
                            name="slug"
                            placeholder="Slug (optional)"
                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#222', color: '#fff' }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                background: 'var(--color-white)',
                                color: 'var(--color-charcoal)',
                                border: 'none',
                                padding: '0 1.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            )}

            <div className="subcategories-list">
                {subCategories.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {subCategories.map(sub => (
                            <div key={sub.id} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '1rem',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <span style={{ color: '#fff', fontWeight: 500 }}>{sub.name}</span>
                                <button
                                    onClick={() => handleDelete(sub.id)}
                                    style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
                                    title="Delete"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-stone-text)', fontStyle: 'italic' }}>No subcategories yet.</p>
                )}
            </div>
        </div>
    );
}

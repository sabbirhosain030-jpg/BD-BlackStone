'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all its subcategories and products.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Reload categories
                loadCategories();
            } else {
                const error = await response.text();
                alert('Error deleting category: ' + error);
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Failed to delete category');
        }
    };

    if (loading) {
        return (
            <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div style={{ color: 'var(--color-white)' }}>Loading categories...</div>
            </div>
        );
    }

    return (
        <div className="admin-categories">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">📦 Main Categories & Subcategories</h1>
                    <p style={{ color: 'var(--color-stone-text)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        Main categories (e.g., Men, Women, Kids) contain subcategories (e.g., T-Shirts, Pants, Kurtis)
                    </p>
                </div>
                <Link href="/admin/categories/add">
                    <button className="btn btn-secondary">
                        + Add Main Category
                    </button>
                </Link>
            </div>

            <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category.id} className="stone-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ color: 'var(--color-white)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>{category.name}</h3>
                                    <code style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>/{category.slug}</code>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                        <button className="btn btn-sm btn-ghost" title="Edit">✏️</button>
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        style={{ color: 'var(--color-error)' }}
                                        title="Delete"
                                        onClick={() => handleDelete(category.id, category.name)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                {category.description || 'No description'}
                            </p>

                            <div className="subcategories-section" style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)' }}>
                                        🏷️ Subcategories ({category.subCategories.length})
                                    </span>
                                    <Link href={`/admin/categories/${category.id}/subcategories`}>
                                        <button style={{ fontSize: '0.8rem', color: 'var(--color-white)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Manage</button>
                                    </Link>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {category.subCategories.length > 0 ? (
                                        category.subCategories.map((sub: { id: string; name: string }) => (
                                            <span key={sub.id} style={{
                                                background: 'var(--color-background)',
                                                color: 'var(--color-text-primary)',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.85rem',
                                                border: '1px solid var(--color-border)'
                                            }}>
                                                └─ {sub.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>No subcategories added</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="stone-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
                        <p>No categories found.</p>
                        <Link href="/admin/categories/add">
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Create First Category</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ManageSubcategoriesPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<any>(null);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadCategory();
    }, [categoryId]);

    const loadCategory = async () => {
        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`);
            const data = await response.json();
            setCategory(data);
        } catch (error) {
            console.error('Failed to load category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubcategoryName.trim()) return;

        setAdding(true);
        try {
            const response = await fetch('/api/admin/subcategories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newSubcategoryName,
                    categoryId: categoryId
                })
            });

            if (response.ok) {
                setNewSubcategoryName('');
                loadCategory(); // Reload to show new subcategory
            } else {
                const error = await response.text();
                alert('Error adding subcategory: ' + error);
            }
        } catch (error) {
            console.error('Failed to add subcategory:', error);
            alert('Failed to add subcategory');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteSubcategory = async (subId: string, subName: string) => {
        if (!confirm(`Are you sure you want to delete "${subName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/subcategories/${subId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadCategory();
            } else {
                const error = await response.text();
                alert('Error deleting subcategory: ' + error);
            }
        } catch (error) {
            console.error('Failed to delete subcategory:', error);
            alert('Failed to delete subcategory');
        }
    };

    if (loading) {
        return (
            <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div style={{ color: 'var(--color-white)' }}>Loading...</div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="admin-content" style={{ padding: '3rem' }}>
                <div style={{ color: 'var(--color-white)' }}>Category not found</div>
            </div>
        );
    }

    return (
        <div className="manage-subcategories-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Manage Subcategories</h1>
                    <p style={{ color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                        Category: <strong style={{ color: 'var(--color-gold)' }}>{category.name}</strong>
                    </p>
                </div>
                <Link href="/admin/categories">
                    <button className="btn btn-secondary">← Back to Categories</button>
                </Link>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
                {/* Add New Subcategory */}
                <div className="stone-card">
                    <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Add New Subcategory</h3>
                    <form onSubmit={handleAddSubcategory} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            placeholder="e.g., Shirt, Panjabi, Kurti"
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'var(--color-stone-dark)',
                                border: '1px solid var(--color-stone-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-white)',
                                outline: 'none'
                            }}
                            disabled={adding}
                        />
                        <button
                            type="submit"
                            disabled={adding || !newSubcategoryName.trim()}
                            style={{
                                background: 'var(--color-gold)',
                                color: 'var(--color-charcoal)',
                                padding: '0.75rem 2rem',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                opacity: (adding || !newSubcategoryName.trim()) ? 0.5 : 1
                            }}
                        >
                            {adding ? 'Adding...' : '+ Add'}
                        </button>
                    </form>
                </div>

                {/* Existing Subcategories */}
                <div className="stone-card">
                    <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
                        Existing Subcategories ({category.subCategories?.length || 0})
                    </h3>

                    {category.subCategories && category.subCategories.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {category.subCategories.map((sub: any) => (
                                <div
                                    key={sub.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: 'var(--color-stone-dark)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-stone-border)'
                                    }}
                                >
                                    <div>
                                        <div style={{ color: 'var(--color-white)', fontWeight: 500 }}>
                                            {sub.name}
                                        </div>
                                        <code style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)' }}>
                                            /{sub.slug}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                                        style={{
                                            background: 'var(--color-error)',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--color-stone-text)', fontStyle: 'italic' }}>
                            No subcategories yet. Add one above!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

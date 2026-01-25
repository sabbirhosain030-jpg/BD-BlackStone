'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../../admin.css';

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [category, setCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        brand: 'BLACK STONE'
    });

    useEffect(() => {
        loadCategory();
    }, [categoryId]);

    const loadCategory = async () => {
        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`);
            const data = await response.json();
            setCategory(data);
            setFormData({
                name: data.name || '',
                slug: data.slug || '',
                description: data.description || '',
                brand: data.brand || 'BLACK STONE'
            });
        } catch (error) {
            console.error('Failed to load category:', error);
            alert('Failed to load category');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                router.push('/admin/categories');
            } else {
                const error = await response.text();
                alert('Error updating category: ' + error);
            }
        } catch (error) {
            console.error('Failed to update category:', error);
            alert('Failed to update category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${category.name}"? This will also delete all its subcategories.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                router.push('/admin/categories');
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
                <div style={{ color: 'var(--color-white)' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="edit-category-page">
            <div className="admin-header">
                <h1 className="admin-title">Edit Category</h1>
            </div>

            <div className="stone-card" style={{ maxWidth: '700px' }}>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="form-input"
                            required
                            placeholder="e.g. Men"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="form-input"
                            required
                            placeholder="e.g. men"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="form-input"
                            rows={4}
                            placeholder="Category description..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Brand</label>
                        <select
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="form-input"
                            required
                        >
                            <option value="BLACK STONE">BLACK STONE</option>
                            <option value="GAZZELLE">GAZZELLE</option>
                        </select>
                    </div>

                    {category?.subCategories && category.subCategories.length > 0 && (
                        <div className="form-group">
                            <label className="form-label">Subcategories ({category.subCategories.length})</label>
                            <div style={{ background: 'var(--color-stone-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-stone-border)' }}>
                                {category.subCategories.map((sub: any) => (
                                    <div key={sub.id} style={{ padding: '0.5rem 0', color: 'var(--color-white)' }}>
                                        └─ {sub.name}
                                    </div>
                                ))}
                                <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-stone-text)' }}>
                                    To manage subcategories, click "Manage" on the categories list page
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="admin-btn-primary" disabled={saving} style={{ flex: 1 }}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="admin-btn-danger"
                            style={{ flex: 1, background: 'var(--color-error)', color: 'white' }}
                        >
                            Delete Category
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-label {
                    display: block;
                    color: var(--color-stone-text);
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: var(--color-stone-dark);
                    border: 1px solid var(--color-stone-border);
                    border-radius: var(--radius-md);
                    color: var(--color-white);
                    font-family: var(--font-body);
                    outline: none;
                }
                .form-input:focus {
                    border-color: var(--color-gold);
                }
                .admin-btn-primary, .admin-btn-danger {
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .admin-btn-primary {
                    background-color: var(--color-gold);
                    color: var(--color-charcoal);
                }
                .admin-btn-primary:hover {
                    opacity: 0.9;
                }
                .admin-btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .admin-btn-danger:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

interface SubCategory {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    category?: { name: string };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function SubCategoriesPage() {
    const router = useRouter();
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        categoryId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [subCatRes, catRes] = await Promise.all([
                fetch('/api/admin/subcategories'),
                fetch('/api/admin/categories')
            ]);
            const subCatData = await subCatRes.json();
            const catData = await catRes.json();
            setSubcategories(subCatData);
            setCategories(catData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const slug = generateSlug(formData.name);
        const payload = { ...formData, slug };

        try {
            const url = editingId
                ? `/api/admin/subcategories/${editingId}`
                : '/api/admin/subcategories';

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(editingId ? 'Subcategory updated!' : 'Subcategory created!');
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', categoryId: '' });
                loadData();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save subcategory');
            }
        } catch (error) {
            alert('Error saving subcategory');
        }
    };

    const handleEdit = (sub: SubCategory) => {
        setEditingId(sub.id);
        setFormData({ name: sub.name, categoryId: sub.categoryId });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this subcategory?')) return;

        try {
            const res = await fetch(`/api/admin/subcategories/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Subcategory deleted!');
                loadData();
            } else {
                alert('Failed to delete subcategory');
            }
        } catch (error) {
            alert('Error deleting subcategory');
        }
    };

    if (loading) return <div className="admin-container"><p>Loading...</p></div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Subcategories</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormData({ name: '', categoryId: '' });
                        }}
                        className="btn-primary"
                    >
                        {showForm ? 'Cancel' : 'Add Subcategory'}
                    </button>
                    <button onClick={() => router.push('/admin')} className="btn-secondary">
                        Dashboard
                    </button>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="admin-form" style={{ marginBottom: '2rem' }}>
                    <div className="form-section">
                        <h2>{editingId ? 'Edit' : 'Add'} Subcategory</h2>

                        <div className="form-group">
                            <label>Parent Category *</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Select category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Subcategory Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Boys, Girls"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            {editingId ? 'Update' : 'Create'} Subcategory
                        </button>
                    </div>
                </form>
            )}

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Parent Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.map(sub => (
                            <tr key={sub.id}>
                                <td><strong>{sub.name}</strong></td>
                                <td><code>{sub.slug}</code></td>
                                <td>{sub.category?.name || 'N/A'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(sub)}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem 1rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="btn-danger"
                                            style={{ padding: '0.5rem 1rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {subcategories.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        No subcategories yet. Create one to get started!
                    </p>
                )}
            </div>
        </div>
    );
}

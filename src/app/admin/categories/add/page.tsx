'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../admin.css';

export default function AddCategoryPage() {
    const router = useRouter();
    const [subcategories, setSubcategories] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);

    const addSubcategoryField = () => {
        setSubcategories([...subcategories, '']);
    };

    const removeSubcategoryField = (index: number) => {
        setSubcategories(subcategories.filter((_, i) => i !== index));
    };

    const updateSubcategory = (index: number, value: string) => {
        const updated = [...subcategories];
        updated[index] = value;
        setSubcategories(updated);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Add subcategories as JSON string
        const validSubcategories = subcategories.filter(s => s.trim() !== '');
        formData.append('subcategories', JSON.stringify(validSubcategories));

        try {
            const response = await fetch('/api/admin/categories/create', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                router.push('/admin/categories');
            } else {
                const error = await response.text();
                alert('Error creating category: ' + error);
            }
        } catch (error) {
            console.error('Failed to create category:', error);
            alert('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-category-page">
            <div className="admin-header">
                <h1 className="admin-title">Add New Category</h1>
            </div>

            <div className="stone-card" style={{ maxWidth: '700px' }}>
                <form onSubmit={handleSubmit} className="admin-form">

                    <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input type="text" name="name" className="form-input" required placeholder="e.g. Men" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Slug (Optional)</label>
                        <input type="text" name="slug" className="form-input" placeholder="e.g. men" />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)', marginTop: '0.25rem' }}>
                            If left blank, it will be generated from the name.
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-input" rows={4} placeholder="Category description..."></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Brand</label>
                        <select name="brand" className="form-input" required>
                            <option value="BLACK STONE">BLACK STONE</option>
                            <option value="GAZZELLE">GAZZELLE</option>
                        </select>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)', marginTop: '0.25rem' }}>
                            Assign this category to a brand collection
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subcategories (Optional)</label>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)', marginBottom: '1rem' }}>
                            Add subcategories like Shirt, Pant, T-Shirt, etc.
                        </p>

                        {subcategories.map((subcat, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <input
                                    type="text"
                                    value={subcat}
                                    onChange={(e) => updateSubcategory(index, e.target.value)}
                                    className="form-input"
                                    placeholder={`Subcategory ${index + 1} (e.g., Shirt, Panjabi)`}
                                    style={{ flex: 1 }}
                                />
                                {subcategories.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSubcategoryField(index)}
                                        className="btn-remove"
                                        style={{
                                            background: 'var(--color-error)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.75rem 1rem',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            minWidth: '80px'
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSubcategoryField}
                            style={{
                                background: 'var(--color-stone-dark)',
                                color: 'var(--color-gold)',
                                border: '1px solid var(--color-gold)',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                marginTop: '0.5rem'
                            }}
                        >
                            + Add Another Subcategory
                        </button>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="admin-btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Category'}
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
        .admin-btn-primary {
            background-color: var(--color-gold);
            color: var(--color-charcoal);
            padding: 1rem 2rem;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s;
        }
        .admin-btn-primary:hover {
            background-color: var(--color-gold-light);
        }
        .admin-btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}

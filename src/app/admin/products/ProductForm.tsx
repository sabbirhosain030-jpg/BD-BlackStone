'use client';

import React, { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    subCategories?: SubCategory[];
}

interface SubCategory {
    id: string;
    name: string;
    categoryId: string;
}

interface ProductFormProps {
    categories: Category[];
    initialData?: any;
    action: (formData: FormData) => Promise<void>;
    submitText: string;
}

export default function ProductForm({ categories, initialData, action, submitText }: ProductFormProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || '');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(initialData?.subCategoryId || '');

    useEffect(() => {
        if (selectedCategoryId) {
            const category = categories.find(c => c.id === selectedCategoryId);
            setSubCategories(category?.subCategories || []);
            // Only reset subcategory if it belongs to a different category
            if (initialData?.categoryId !== selectedCategoryId) {
                // setSelectedSubCategoryId(''); // Optional: auto-reset
            }
        } else {
            setSubCategories([]);
        }
    }, [selectedCategoryId, categories, initialData]);

    return (
        <form action={action} className="admin-form">
            <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                    type="text"
                    name="name"
                    className="form-input"
                    required
                    defaultValue={initialData?.name}
                    placeholder="e.g. Classic Charcoal Suit"
                />
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Price (৳)</label>
                    <input
                        type="number"
                        name="price"
                        className="form-input"
                        required
                        defaultValue={initialData?.price}
                        placeholder="12500"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Previous Price (Optional)</label>
                    <input
                        type="number"
                        name="previousPrice"
                        className="form-input"
                        defaultValue={initialData?.previousPrice}
                        placeholder="15000"
                    />
                </div>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                        name="categoryId"
                        className="form-input"
                        required
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Subcategory (Optional)</label>
                    <select
                        name="subCategoryId"
                        className="form-input"
                        value={selectedSubCategoryId}
                        onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                    >
                        <option value="">No Subcategory</option>
                        {subCategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                    type="number"
                    name="stock"
                    className="form-input"
                    required
                    defaultValue={initialData?.stock || 0}
                    placeholder="10"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    className="form-input"
                    rows={4}
                    required
                    defaultValue={initialData?.description}
                    placeholder="Product description..."
                ></textarea>
            </div>

            <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                    type="url"
                    name="imageUrl"
                    className="form-input"
                    required
                    defaultValue={initialData?.images ? JSON.parse(initialData.images)[0] : ''}
                    placeholder="https://..."
                />
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Sizes (JSON string)</label>
                    <input
                        type="text"
                        name="sizes"
                        className="form-input"
                        defaultValue={initialData?.sizes || '["S", "M", "L", "XL"]'}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Colors (JSON string)</label>
                    <input
                        type="text"
                        name="colors"
                        className="form-input"
                        defaultValue={initialData?.colors || '["Black", "Navy", "Grey"]'}
                    />
                </div>
            </div>

            <div className="form-checks" style={{ display: 'flex', gap: '2rem', marginTop: '1rem', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="isNew"
                        defaultChecked={initialData?.isNew}
                        style={{ width: '18px', height: '18px' }}
                    />
                    Mark as "New Arrival"
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="isFeatured"
                        defaultChecked={initialData?.isFeatured}
                        style={{ width: '18px', height: '18px' }}
                    />
                    Feature on Homepage
                </label>
            </div>

            <div className="form-actions">
                <button type="submit" className="admin-btn-primary">
                    {submitText}
                </button>
            </div>

            <style jsx>{`
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
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
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
            `}</style>
        </form>
    );
}

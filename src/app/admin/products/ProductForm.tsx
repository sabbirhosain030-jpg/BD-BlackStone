'use client';

import React, { useState, useEffect } from 'react';

import MultiImageUpload from '@/components/ui/MultiImageUpload';

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

    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState(''); // Compatibility

    useEffect(() => {
        if (initialData?.images) {
            try {
                const parsed = JSON.parse(initialData.images);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setImages(parsed);
                    setImageUrl(parsed[0]);
                } else if (typeof parsed === 'string') {
                    setImages([parsed]);
                    setImageUrl(parsed);
                }
            } catch (e) {
                // ignore
            }
        }
    }, [initialData]);

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
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

            {/* ... other fields ... */}

            <div className="form-group">
                <MultiImageUpload
                    label="Product Images"
                    initialUrls={images}
                    onUpload={(urls) => {
                        setImages(urls);
                        setImageUrl(urls[0] || '');
                    }}
                    required
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
        </form>
    );
}

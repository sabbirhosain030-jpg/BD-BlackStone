'use client';

import React, { useState, useEffect } from 'react';

import MultiImageUpload from '@/components/ui/MultiImageUpload';
import ColorPicker from '@/components/ui/ColorPicker';

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

import { useFormStatus } from 'react-dom';

function SubmitButton({ text, className }: { text: string; className?: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            className={`admin-btn-primary ${className || ''}`}
            disabled={pending}
            style={{ opacity: pending ? 0.7 : 1 }}
        >
            {pending ? 'Processing...' : text}
        </button>
    );
}

export default function ProductForm({ categories, initialData, action, submitText }: ProductFormProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || '');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(initialData?.subCategoryId || '');

    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState(''); // Compatibility
    const [isShaking, setIsShaking] = useState(false);

    // Color management
    const [colors, setColors] = useState<string[]>([]);

    // Error handling wrapper
    async function handleAction(formData: FormData) {
        // Client-side validation
        const name = formData.get('name');
        const price = formData.get('price');
        const categoryId = formData.get('categoryId');
        const description = formData.get('description');

        const errors = [];
        if (!name) errors.push('Name');
        if (!price) errors.push('Price');
        if (!categoryId) errors.push('Category');
        if (!description) errors.push('Description');
        if (images.length === 0) errors.push('Images');

        if (errors.length > 0) {
            // Show error message to user
            alert(`Please fill in the following required fields:\n\n${errors.join('\n')}`);
            // Trigger Shake Animation
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500); // Remove class after animation
            return;
        }

        try {
            await action(formData);
        } catch (error: any) {
            alert(`Error: ${error.message || 'Something went wrong. Please check all required fields.'}`);
        }
    }

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

        // Initialize colors from initialData
        if (initialData?.colors) {
            try {
                const parsedColors = JSON.parse(initialData.colors);
                if (Array.isArray(parsedColors)) {
                    setColors(parsedColors);
                }
            } catch (e) {
                // If it's not JSON, treat as comma-separated string
                const colorArray = initialData.colors.split(',').map((c: string) => c.trim()).filter(Boolean);
                setColors(colorArray);
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
        <form action={handleAction} className="admin-form">
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

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

            {/* Color Picker */}
            <ColorPicker
                label="Product Colors"
                initialColors={colors}
                onChange={setColors}
                required={false}
            />
            <input type="hidden" name="colors" value={JSON.stringify(colors)} />

            {/* Sizes */}
            <div className="form-group">
                <label className="form-label">Available Sizes (comma-separated)</label>
                <input
                    type="text"
                    name="sizes"
                    className="form-input"
                    defaultValue={initialData?.sizes ? JSON.parse(initialData.sizes).join(', ') : 'S, M, L, XL'}
                    placeholder="e.g. S, M, L, XL, XXL"
                />
                <small style={{ color: 'var(--color-stone-text)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
                    Enter sizes separated by commas. They will be stored as individual options.
                </small>
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
                <SubmitButton text={submitText} className={isShaking ? 'animate-shake' : ''} />
            </div>
        </form>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import MultiImageUpload from '@/components/ui/MultiImageUpload';
import './inventory-form.css';

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

interface InventoryFormProps {
    categories: Category[];
    initialData?: any;
    action: (formData: FormData) => Promise<void>;
    submitText: string;
}

export default function InventoryForm({ categories, initialData, action, submitText }: InventoryFormProps) {
    // State Management - Only fields that exist in database
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        categoryId: initialData?.categoryId || '',
        subCategoryId: initialData?.subCategoryId || '',
        price: initialData?.price || '',
        previousPrice: initialData?.previousPrice || '',
        stock: initialData?.stock || 0,
        description: initialData?.description || '',
        sizes: '',
        isNew: initialData?.isNew || false,
        isFeatured: initialData?.isFeatured || false,
    });

    const [images, setImages] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Initialize data
    useEffect(() => {
        if (initialData?.images) {
            try {
                const parsed = JSON.parse(initialData.images);
                setImages(Array.isArray(parsed) ? parsed : [parsed]);
            } catch (e) {
                console.error('Failed to parse images');
            }
        }

        if (initialData?.colors) {
            try {
                const parsed = JSON.parse(initialData.colors);
                setColors(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                console.error('Failed to parse colors');
            }
        }

        if (initialData?.sizes) {
            try {
                const parsed = JSON.parse(initialData.sizes);
                setFormData(prev => ({ ...prev, sizes: Array.isArray(parsed) ? parsed.join(', ') : '' }));
            } catch (e) {
                console.error('Failed to parse sizes');
            }
        }
    }, [initialData]);

    // Update subcategories when category changes
    useEffect(() => {
        if (formData.categoryId) {
            const category = categories.find(c => c.id === formData.categoryId);
            setSubCategories(category?.subCategories || []);
        } else {
            setSubCategories([]);
            setFormData(prev => ({ ...prev, subCategoryId: '' }));
        }
    }, [formData.categoryId, categories]);

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
        if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'Stock quantity is required';
        if (images.length === 0) newErrors.images = 'At least one image is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const submitFormData = new FormData();

            // Add all form fields (matching existing server action)
            submitFormData.append('name', formData.name);
            submitFormData.append('categoryId', formData.categoryId);
            if (formData.subCategoryId) submitFormData.append('subCategoryId', formData.subCategoryId);
            submitFormData.append('price', formData.price.toString());
            if (formData.previousPrice) submitFormData.append('previousPrice', formData.previousPrice.toString());
            submitFormData.append('stock', formData.stock.toString());
            submitFormData.append('description', formData.description);

            // Add images (existing server action expects these exact field names)
            submitFormData.append('imagesJson', JSON.stringify(images));
            submitFormData.append('imageUrl', images[0] || '');

            // Add sizes (convert comma-separated to JSON array)
            const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
            submitFormData.append('sizes', formData.sizes);  // Server action handles parsing

            // Add colors (already JSON)
            submitFormData.append('colors', JSON.stringify(colors));

            // Add checkboxes
            submitFormData.append('isNew', formData.isNew ? 'on' : '');
            submitFormData.append('isFeatured', formData.isFeatured ? 'on' : '');

            await action(submitFormData);

            setSuccessMessage('Product saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

            // Reset form if adding new product
            if (!initialData) {
                setFormData({
                    name: '', categoryId: '', subCategoryId: '',
                    price: '', previousPrice: '', stock: 0,
                    description: '', sizes: '',
                    isNew: false, isFeatured: false,
                });
                setImages([]);
                setColors([]);
            }
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save product. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add color
    const addColor = (color: string) => {
        if (color && !colors.includes(color)) {
            setColors([...colors, color]);
        }
    };

    // Remove color
    const removeColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="inventory-form">
            {/* Success Message */}
            {successMessage && (
                <div className="success-banner">{successMessage}</div>
            )}

            {/* Error Summary */}
            {errors.submit && (
                <div className="error-banner">{errors.submit}</div>
            )}

            {/* Section 1: Basic Information */}
            <div className="form-section">
                <h3 className="section-title">Basic Information</h3>

                <div className="form-group">
                    <label className="form-label label-required">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="e.g. Classic Black Suit"
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
            </div>

            {/* Section 2: Classification */}
            <div className="form-section">
                <h3 className="section-title">Classification</h3>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label label-required">Category</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className={`form-input ${errors.categoryId ? 'error' : ''}`}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subcategory</label>
                        <select
                            name="subCategoryId"
                            value={formData.subCategoryId}
                            onChange={handleChange}
                            className="form-input"
                            disabled={subCategories.length === 0}
                        >
                            <option value="">No Subcategory</option>
                            {subCategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Section 3: Pricing & Inventory */}
            <div className="form-section">
                <h3 className="section-title">Pricing & Stock</h3>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label label-required">Price (৳)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`form-input ${errors.price ? 'error' : ''}`}
                            placeholder="2500"
                            min="0"
                            step="0.01"
                        />
                        {errors.price && <div className="error-message">{errors.price}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Previous Price (৳)</label>
                        <input
                            type="number"
                            name="previousPrice"
                            value={formData.previousPrice}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="3000"
                            min="0"
                            step="0.01"
                        />
                        <small className="form-hint">For showing discounts</small>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label label-required">Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`form-input ${errors.stock ? 'error' : ''}`}
                        placeholder="10"
                        min="0"
                    />
                    {errors.stock && <div className="error-message">{errors.stock}</div>}
                </div>
            </div>

            {/* Section 4: Product Description */}
            <div className="form-section">
                <h3 className="section-title">Product Description</h3>

                <div className="form-group">
                    <label className="form-label label-required">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-input ${errors.description ? 'error' : ''}`}
                        rows={6}
                        placeholder="Detailed product description, features, materials, care instructions..."
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>
            </div>

            {/* Section 5: Product Images */}
            <div className="form-section">
                <h3 className="section-title">Product Images</h3>

                <div className="form-group">
                    <MultiImageUpload
                        label=""
                        initialUrls={images}
                        onUpload={setImages}
                        required={true}
                    />
                    {errors.images && <div className="error-message">{errors.images}</div>}
                </div>
            </div>

            {/* Section 6: Product Variants */}
            <div className="form-section">
                <h3 className="section-title">Product Variants</h3>

                <div className="form-group">
                    <label className="form-label">Available Sizes</label>
                    <input
                        type="text"
                        name="sizes"
                        value={formData.sizes}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="S, M, L, XL, XXL"
                    />
                    <small className="form-hint">Enter sizes separated by commas</small>
                </div>

                <div className="form-group">
                    <label className="form-label">Available Colors</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {colors.map((color, index) => (
                            <div key={index} className="color-tag">
                                <span style={{ backgroundColor: color, width: '16px', height: '16px', borderRadius: '50%', display: 'inline-block', marginRight: '0.5rem' }} />
                                {color}
                                <button type="button" onClick={() => removeColor(index)} className="color-remove">×</button>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="color"
                            id="colorPicker"
                            style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const picker = document.getElementById('colorPicker') as HTMLInputElement;
                                addColor(picker.value);
                            }}
                            className="color-add-btn"
                        >
                            Add Color
                        </button>
                    </div>
                </div>
            </div>

            {/* Section 7: Visibility Options */}
            <div className="form-section">
                <h3 className="section-title">Visibility Options</h3>

                <div className="form-checkboxes">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isNew"
                            checked={formData.isNew}
                            onChange={handleChange}
                        />
                        <span>Mark as "New Arrival"</span>
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />
                        <span>Feature on Homepage</span>
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving Product...' : submitText}
                </button>
            </div>
        </form>
    );
}

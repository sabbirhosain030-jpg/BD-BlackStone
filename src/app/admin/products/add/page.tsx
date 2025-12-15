import React from 'react';
import { getAdminCategories, createProduct } from '../../actions';

export default async function AddProductPage() {
    const categories = await getAdminCategories();

    return (
        <div className="add-product-page">
            <div className="admin-header">
                <h1 className="admin-title">Add New Product</h1>
            </div>

            <div className="stone-card" style={{ maxWidth: '800px' }}>
                <form action={createProduct} className="admin-form">

                    <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input type="text" name="name" className="form-input" required placeholder="e.g. Classic Charcoal Suit" />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Price (৳)</label>
                            <input type="number" name="price" className="form-input" required placeholder="12500" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Previous Price (Optional)</label>
                            <input type="number" name="previousPrice" className="form-input" placeholder="15000" />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select name="categoryId" className="form-input" required>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stock Quantity</label>
                            <input type="number" name="stock" className="form-input" required placeholder="10" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-input" rows={4} required placeholder="Product description..."></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL</label>
                        <input type="url" name="imageUrl" className="form-input" required placeholder="https://..." />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-stone-text)', marginTop: '0.25rem' }}>
                            Note: For now, please paste a direct image link.
                        </p>
                    </div>

                    <div className="form-checks" style={{ display: 'flex', gap: '2rem', marginTop: '1rem', marginBottom: '2rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                            <input type="checkbox" name="isNew" style={{ width: '18px', height: '18px' }} />
                            Mark as "New Arrival"
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-white)', cursor: 'pointer' }}>
                            <input type="checkbox" name="isFeatured" style={{ width: '18px', height: '18px' }} />
                            Feature on Homepage
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="admin-btn-primary">
                            Create Product
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
        </div>
    );
}

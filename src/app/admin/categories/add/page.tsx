import React from 'react';
import { createCategory } from '../../actions';

export default function AddCategoryPage() {
    return (
        <div className="add-category-page">
            <div className="admin-header">
                <h1 className="admin-title">Add New Category</h1>
            </div>

            <div className="stone-card" style={{ maxWidth: '600px' }}>
                <form action={createCategory} className="admin-form">

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

                    <div className="form-actions">
                        <button type="submit" className="admin-btn-primary">
                            Create Category
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
      `}</style>
        </div>
    );
}

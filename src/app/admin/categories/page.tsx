import React from 'react';
import Link from 'next/link';
import { getAdminCategories } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
    const categories = await getAdminCategories();

    return (
        <div className="admin-categories">
            <div className="admin-header">
                <h1 className="admin-title">Categories</h1>
                <Link href="/admin/categories/add">
                    <button style={{
                        backgroundColor: 'var(--color-gold)',
                        color: 'var(--color-charcoal)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        + Add Category
                    </button>
                </Link>
            </div>

            <div className="stone-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="recent-orders-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td style={{ color: 'var(--color-white)', fontWeight: 500 }}>{category.name}</td>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--color-stone-text)' }}>{category.slug}</td>
                                    <td>{category.description || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link href={`/admin/categories/${category.id}`}>
                                                <button style={{
                                                    background: 'transparent',
                                                    border: '1px solid var(--color-gold)',
                                                    color: 'var(--color-gold)',
                                                    cursor: 'pointer',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '4px'
                                                }}>Manage</button>
                                            </Link>
                                            <button style={{ color: 'var(--color-stone-text)', cursor: 'pointer', background: 'none', border: 'none', padding: '0.25rem' }}>Edit</button>
                                            {/* We can implement client-side delete later or use a form for server action */}
                                            <button style={{ color: 'var(--color-error)', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone-text)' }}>
                                    No categories found. Add some!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

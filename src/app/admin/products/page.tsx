import React from 'react';
import Image from 'next/image';
import { getAdminProducts } from '../actions';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await getAdminProducts();

    return (
        <div className="admin-products">
            <div className="admin-header">
                <h1 className="admin-title">Products</h1>
                <Link href="/admin/products/add">
                    <button style={{
                        backgroundColor: 'var(--color-gold)',
                        color: 'var(--color-charcoal)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        + Add Product
                    </button>
                </Link>
            </div>

            <div className="stone-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="recent-orders-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Image</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => {
                                let imageUrl = '/placeholder.png';
                                try {
                                    const images = JSON.parse(product.images);
                                    if (Array.isArray(images) && images.length > 0) {
                                        imageUrl = images[0];
                                    }
                                } catch (e) {
                                    console.error("Failed to parse product images", e);
                                }

                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--color-stone-border)' }}>
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--color-white)', fontWeight: 500 }}>{product.name}</td>
                                        <td>{product.category?.name || 'Uncategorized'}</td>
                                        <td style={{ color: 'var(--color-stone-text)' }}>{product.subCategory?.name || '-'}</td>
                                        <td style={{ fontWeight: 600 }}>৳ {product.price.toLocaleString()}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            {product.stock > 0 ? (
                                                <span className="status-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>In Stock</span>
                                            ) : (
                                                <span className="status-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>Out of Stock</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <Link href={`/admin/products/${product.id}`} style={{ color: 'var(--color-stone-text)', textDecoration: 'none' }}>
                                                    Edit
                                                </Link>
                                                <DeleteButton productId={product.id} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone-text)' }}>
                                    No products found in database.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import React from 'react';
import Link from 'next/link';
import { getAllWishlists, deleteWishlistEntry, getMostWishlisted } from '../actions';
import Image from 'next/image';
import '../admin.css';

export const revalidate = 0; // Always get fresh data

export default async function WishlistsPage() {
    const wishlists = await getAllWishlists();
    const mostWishlisted = await getMostWishlisted(5);

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteWishlistEntry(id);
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Wishlist Management</h1>
                <p>Track which products customers are saving to their wishlists</p>
            </div>

            {/* Most Wishlisted Products */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Most Wishlisted Products</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {mostWishlisted.length > 0 ? (
                        mostWishlisted.map((item) => {
                            if (!item.product) return null;
                            let imageUrl = '/placeholder.png';
                            try {
                                const images = JSON.parse(item.product.images);
                                if (Array.isArray(images) && images.length > 0) {
                                    imageUrl = images[0];
                                }
                            } catch (e) { }

                            return (
                                <div
                                    key={item.product.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: '#f9f9f9',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={item.product.name}
                                        width={60}
                                        height={60}
                                        style={{ borderRadius: '6px', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            {item.product.name}
                                        </h3>
                                        <p style={{ color: '#666', fontSize: '0.875rem' }}>
                                            {item.product.price.toLocaleString()} BDT • Stock: {item.product.stock}
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            color: '#d4af37',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                        {item.wishlistCount}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                            No wishlist data yet. Add products to wishlists to see stats here.
                        </p>
                    )}
                </div>
            </div>

            {/* All Wishlist Entries */}
            <div className="admin-card">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>All Wishlist Entries</h2>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>User</th>
                                <th>Added</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlists.length > 0 ? (
                                wishlists.map((wishlist) => {
                                    let imageUrl = '/placeholder.png';
                                    try {
                                        const images = JSON.parse(wishlist.product.images);
                                        if (Array.isArray(images) && images.length > 0) {
                                            imageUrl = images[0];
                                        }
                                    } catch (e) { }

                                    return (
                                        <tr key={wishlist.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <Image
                                                        src={imageUrl}
                                                        alt={wishlist.product.name}
                                                        width={40}
                                                        height={40}
                                                        style={{ borderRadius: '4px', objectFit: 'cover' }}
                                                    />
                                                    <Link
                                                        href={`/products/${wishlist.product.id}`}
                                                        style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: '500' }}
                                                        target="_blank"
                                                    >
                                                        {wishlist.product.name}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td>{wishlist.product.price.toLocaleString()} BDT</td>
                                            <td>{wishlist.userEmail || wishlist.sessionId?.substring(0, 8) || 'Guest'}</td>
                                            <td>{new Date(wishlist.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <form action={handleDelete} style={{ display: 'inline' }}>
                                                    <input type="hidden" name="id" value={wishlist.id} />
                                                    <button
                                                        type="submit"
                                                        className="btn-delete"
                                                        style={{
                                                            background: '#d42c2c',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                                        No wishlist entries found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

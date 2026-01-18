'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (item: any) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: 'Standard',
            quantity: 1
        });
    };

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '60vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    marginBottom: '0.5rem',
                    color: 'var(--color-charcoal)'
                }}>
                    My Wishlist
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '3rem' }}>
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>

                {wishlist.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'var(--color-cream)',
                        borderRadius: '12px'
                    }}>
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-text-light)"
                            strokeWidth="1.5"
                            style={{ margin: '0 auto 1.5rem' }}
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
                            Your Wishlist is Empty
                        </h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                            Save your favorite items by clicking the heart icon
                        </p>
                        <Link
                            href="/products"
                            style={{
                                display: 'inline-block',
                                padding: '0.875rem 2rem',
                                background: 'var(--color-gold)',
                                color: 'white',
                                borderRadius: '4px',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid #f0f0f0'
                                }}
                                className="wishlist-item"
                            >
                                <Link href={`/products/${item.id}`}>
                                    <div style={{
                                        position: 'relative',
                                        paddingTop: '125%',
                                        background: '#f9f9f9'
                                    }}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </Link>

                                <div style={{ padding: '1.25rem' }}>
                                    <Link href={`/products/${item.id}`}>
                                        <h3 style={{
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem',
                                            color: 'var(--color-charcoal)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {item.name}
                                        </h3>
                                    </Link>

                                    <p style={{
                                        fontSize: '1.125rem',
                                        fontWeight: '700',
                                        color: 'var(--color-charcoal)',
                                        marginBottom: '1rem'
                                    }}>
                                        {item.price.toLocaleString()} BDT
                                    </p>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                background: 'var(--color-gold)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            style={{
                                                padding: '0.75rem',
                                                background: 'transparent',
                                                color: 'var(--color-text-secondary)',
                                                border: '1px solid #ddd',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            title="Remove from wishlist"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .wishlist-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
                }
                
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
}

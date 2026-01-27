'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import './ProductCard.css';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    previousPrice?: number;
    image: string;
    category?: string;
    isNew?: boolean;
    imagePosition?: string;
    variant?: 'grid' | 'list';
    index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    previousPrice,
    image,
    category,
    isNew,
    imagePosition = 'center',
    variant = 'grid',
    index = 0
}) => {
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [isAdded, setIsAdded] = useState(false);
    const discount = previousPrice ? Math.round(((previousPrice - price) / previousPrice) * 100) : 0;

    const inWishlist = isInWishlist(id);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }

        if (inWishlist) {
            await removeFromWishlist(id);
        } else {
            await addToWishlist(id);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }

        addToCart({
            id,
            name,
            price,
            image,
            size: 'Standard',
            quantity: 1
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div
            className={`product-card ${variant === 'list' ? 'product-card-list' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="product-image-wrapper">
                <Link href={`/products/${id}`}>
                    <div className="product-image">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="image"
                            style={{ objectPosition: imagePosition }}
                        />
                    </div>
                </Link>

                {/* Wishlist Button (Subtle Grey Heart) */}
                <button
                    onClick={handleWishlistToggle}
                    className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-label="Toggle wishlist"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill={inWishlist ? '#ef4444' : 'none'}
                        stroke={inWishlist ? '#ef4444' : '#666'}
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Badges */}
                <div className="product-badges">
                    {isNew && <span className="product-badge badge-new">New</span>}
                    {discount > 0 && <span className="product-badge badge-sale">-{discount}%</span>}
                </div>

                {/* Action Buttons Overlay - Desktop Only */}
                <div className="product-actions desktop-actions">
                    <button
                        className={`action-btn ${isAdded ? 'btn-success' : ''}`}
                        title="Add to Cart"
                        onClick={handleAddToCart}
                    >
                        {isAdded ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                        )}
                    </button>
                    <button
                        className="action-btn"
                        title="Buy Now"
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart({ id, name, price, image, size: 'Standard', quantity: 1 });
                            window.location.href = '/checkout';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                    </button>
                    <Link href={`/products/${id}`} className="action-btn" title="Quick View">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="product-info">
                {category && <span className="product-category">{category}</span>}
                <Link href={`/products/${id}`}>
                    <h3 className="product-name">{name}</h3>
                </Link>
                <div className="product-price">
                    <span className="price-current">{price.toLocaleString()} BDT</span>
                    {previousPrice && (
                        <span className="price-previous">{previousPrice.toLocaleString()} BDT</span>
                    )}
                </div>

                {/* Mobile Only: Dual Action Buttons - Stacked */}
                <div className="mobile-actions">
                    <button
                        className={`mobile-cart-btn ${isAdded ? 'added' : 'outline'}`}
                        onClick={handleAddToCart}
                    >
                        {isAdded ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Added
                            </>
                        ) : (
                            'ADD TO CART'
                        )}
                    </button>
                    <button
                        className="mobile-buy-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart({ id, name, price, image, size: 'Standard', quantity: 1 });
                            window.location.href = '/checkout';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        ORDER NOW
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

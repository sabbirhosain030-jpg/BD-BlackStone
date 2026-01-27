'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import './ProductCard.css';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext'; // Restored

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
    index?: number; // For stagger animation
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
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist(); // Restored
    const [isAdded, setIsAdded] = useState(false);
    const discount = previousPrice ? Math.round(((previousPrice - price) / previousPrice) * 100) : 0;

    const inWishlist = isInWishlist(id);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Haptic feedback
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

        // Haptic feedback
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
                delay: index * 0.05, // Stagger effect
                ease: [0.4, 0, 0.2, 1] // Custom easing
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }} // Touch feedback on mobile
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

                {/* Wishlist Button (Restored) */}
                <button
                    onClick={handleWishlistToggle}
                    className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-label="Toggle wishlist"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Badges */}
                <div className="product-badges">
                    {isNew && <span className="product-badge badge-new">New</span>}
                    {discount > 0 && <span className="product-badge badge-sale">-{discount}%</span>}
                </div>

                {/* Action Buttons Overlay */}
                <div className="product-actions">
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

                {/* Mobile Only: Static Add to Cart Button */}
                {/* Mobile Only: Action Buttons */}
                {/* Mobile Only: Dual Action Buttons */}
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
                            'Add to Cart'
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
                        Order Now
                    </button>
                </div>

                <style jsx>{`
                    @media (max-width: 768px) {
                        .mobile-actions {
                            display: grid !important;
                            grid-template-columns: 1fr;
                            gap: 0.5rem;
                            margin-top: 0.75rem;
                            width: 100%;
                        }
                        
                        .mobile-cart-btn, .mobile-buy-btn {
                            width: 100%;
                            padding: 0.5rem;
                            font-size: 0.75rem;
                            font-weight: 700;
                            text-transform: uppercase;
                            border-radius: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 32px;
                            transition: all 0.2s;
                            letter-spacing: 0.5px;
                        }

                        .mobile-cart-btn.outline {
                            background: transparent;
                            border: 1px solid var(--color-charcoal);
                            color: var(--color-charcoal);
                        }
                        
                        .mobile-cart-btn.added {
                            background: var(--color-success);
                            border: 1px solid var(--color-success);
                            color: white;
                            gap: 4px;
                        }

                        .mobile-buy-btn {
                            background: linear-gradient(135deg, #1a1a1c 0%, #000 100%);
                            border: none;
                            color: var(--color-gold);
                            border: 1px solid var(--color-gold);
                        }
                    }
                `}</style>
            </div>
        </motion.div>
    );
};

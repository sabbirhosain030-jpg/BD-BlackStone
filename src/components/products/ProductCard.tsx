'use client';

import React, { useState, memo } from 'react';
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

const ProductCardComponent: React.FC<ProductCardProps> = ({
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

    const handleOrderNow = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({ id, name, price, image, size: 'Standard', quantity: 1 });
        window.location.href = '/checkout';
    };

    return (
        <motion.div
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {/* Image Section */}
            <div className="product-image-wrapper">
                <Link href={`/products/${id}`}>
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="product-image"
                        style={{ objectPosition: imagePosition }}
                    />
                </Link>

                {/* Top Badges */}
                <div className="product-badges">
                    <div className="badge-left">
                        {isNew && <span className="new-badge">NEW</span>}
                        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        aria-label="Toggle wishlist"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={inWishlist ? '#d4af37' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Text Section */}
            <div className="product-info">
                {category && <span className="product-category">{category}</span>}

                <Link href={`/products/${id}`}>
                    <h3 className="product-name">{name}</h3>
                </Link>

                <div className="product-price-section">
                    <span className="product-price">
                        ৳{price.toLocaleString()}
                        <span className="currency">BDT</span>
                    </span>
                    {previousPrice && (
                        <span className="product-previous-price">
                            ৳{previousPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            {/* Button Section */}
            <div className="product-actions">
                <button
                    className="btn-order-now"
                    onClick={handleOrderNow}
                >
                    <svg className="btn-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                    </svg>
                    Order Now
                </button>

                <button
                    className={`btn-add-cart ${isAdded ? 'added' : ''}`}
                    onClick={handleAddToCart}
                >
                    {isAdded ? (
                        <>
                            <svg className="btn-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Added
                        </>
                    ) : (
                        <>
                            <svg className="btn-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

// Memoize ProductCard to prevent unnecessary re-renders
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.price === nextProps.price &&
        prevProps.name === nextProps.name &&
        prevProps.image === nextProps.image
    );
});

ProductCard.displayName = 'ProductCard';

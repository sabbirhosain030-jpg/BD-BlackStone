'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
        <div
            className="product-card"
        // generic fade-in handled by CSS if needed, or removed for perf
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
                        priority={index < 4}  // First 4 images load eagerly for LCP
                        loading={index < 4 ? undefined : 'lazy'}  // Lazy load the rest
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
                    ORDER NOW
                </button>

                <button
                    className={`btn-add-cart ${isAdded ? 'added' : ''}`}
                    onClick={handleAddToCart}
                >
                    {isAdded ? '✓ ADDED' : 'ADD TO CART'}
                </button>
            </div>
        </div>
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

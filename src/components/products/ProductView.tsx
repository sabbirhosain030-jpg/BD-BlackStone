'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

// Reuse the type or define a clean interface for what the view needs
interface ProductViewProps {
    product: {
        id: string;
        name: string;
        price: number;
        previousPrice?: number | null;
        description: string;
        images: string[];
        sizes: string[];
        colors?: string[];
        category: string;
        stock: number;
    }
}

export default function ProductView({ product }: ProductViewProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const router = useRouter(); // Initialize router

    const discount = product.previousPrice ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100) : 0;

    // Placeholder features based on category (since we don't store features in DB yet)
    const features = [
        'Premium Quality Materials',
        'Professional Design',
        'Comfortable Fit',
        'Long-lasting Durability',
        'Easy Care'
    ];

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes.length > 0) {
            alert('Please select a size');
            return;
        }
        if (!selectedColor && product.colors && product.colors.length > 0) {
            alert('Please select a color');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0] || '/placeholder.png',
            size: selectedSize,
            color: selectedColor, // Add color to cart item
            quantity: quantity
        });

        alert('Added to cart!');
    };

    return (
        <div className="product-detail-grid">
            {/* Images */}
            <div className="product-images">
                <div className="main-image">
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image
                            src={product.images[selectedImage] || '/placeholder.png'}
                            alt={product.name}
                            fill
                            className="image"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
                <div className="image-thumbnails">
                    {product.images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                            onClick={() => setSelectedImage(idx)}
                        >
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <Image src={img || '/placeholder.png'} alt="" fill className="thumb-image" style={{ objectFit: 'cover' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="product-info-section">
                <div className="product-header">
                    <span className="product-category">{product.category}</span>
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-pricing">
                        <span className="current-price">৳ {product.price.toLocaleString()}</span>
                        {product.previousPrice && (
                            <>
                                <span className="previous-price">৳ {product.previousPrice.toLocaleString()}</span>
                                <span className="discount-badge">Save {discount}%</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="product-description">
                    <p>{product.description}</p>
                </div>

                {/* Size Selection */}
                {product.sizes.length > 0 && (
                    <div className="product-options">
                        <label className="option-label">Select Size</label>
                        <div className="size-options">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                    <div className="product-options">
                        <label className="option-label">Select Color</label>
                        <div className="color-options" style={{ display: 'flex', gap: '10px' }}>
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: color.toLowerCase(),
                                        border: selectedColor === color ? '2px solid var(--color-gold)' : '1px solid #ddd',
                                        boxShadow: selectedColor === color ? '0 0 0 2px white, 0 0 0 4px var(--color-gold)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                />
                            ))}
                        </div>
                        {selectedColor && <span style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px', display: 'block' }}>Color: <b>{selectedColor}</b></span>}
                    </div>
                )}

                {/* Quantity */}
                <div className="product-options">
                    <label className="option-label">Quantity</label>
                    <div className="quantity-selector">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                    </div>
                    <span className="stock-info">{product.stock} items in stock</span>
                </div>

                {/* Actions */}
                <div className="detail-actions">
                    <Button size="lg" fullWidth onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        fullWidth
                        onClick={() => {
                            if (!selectedSize && product.sizes.length > 0) {
                                alert('Please select a size');
                                return;
                            }
                            if (!selectedColor && product.colors && product.colors.length > 0) {
                                alert('Please select a color');
                                return;
                            }
                            addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0] || '/placeholder.png',
                                size: selectedSize,
                                color: selectedColor,
                                quantity: quantity
                            });
                            // Use Next.js router for instant client-side transition instead of full reload
                            const params = new URLSearchParams();
                            // Optional: Pass pre-filled data if we wanted to skip cart, but for now we use cart context.
                            // Just navigating is distinctively faster.
                            router.push('/checkout');
                        }}
                    >
                        Buy Now
                    </Button>
                </div>

                {/* Features */}
                <div className="product-features">
                    <h3>Product Features</h3>
                    <ul>
                        {features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                        ))}
                    </ul>
                </div>

                {/* Delivery Info */}
                <div className="delivery-info">
                    <div className="info-item">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span>Cash on Delivery Available</span>
                    </div>
                    <div className="info-item">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                        </svg>
                        <span>Free Shipping on Orders Over 5,000 BDT</span>
                    </div>
                    <div className="info-item">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        </svg>
                        <span>7-Day Return & Exchange Policy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import './cart.css';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { items: cartItems, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();

    const subtotal = cartTotal;
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shipping;

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started</p>
                        <Link href="/products">
                            <Button variant="primary">Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="cart-grid">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="cart-item">
                                    <div className="item-image">
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <Image src={item.image} alt={item.name} fill className="image" style={{ objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                    <div className="item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-size">Size: {item.size}</p>
                                        <p className="item-price">৳ {item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="item-quantity">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                        >-</button>
                                        <span>{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                        >+</button>
                                    </div>
                                    <div className="item-total">
                                        ৳ {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    <button
                                        className="item-remove"
                                        onClick={() => removeFromCart(item.id, item.size)}
                                    >×</button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="order-summary">
                            <h2 className="summary-title">Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal ({cartCount} items)</span>
                                <span>৳ {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `৳ ${shipping}`}</span>
                            </div>
                            {shipping === 0 && (
                                <p className="free-shipping-note">🎉 You qualify for free shipping!</p>
                            )}
                            {shipping > 0 && subtotal < 5000 && (
                                <p className="shipping-note">
                                    Add ৳ {(5000 - subtotal).toLocaleString()} more for FREE shipping
                                </p>
                            )}
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>৳ {total.toLocaleString()}</span>
                            </div>
                            <Link href="/checkout">
                                <Button variant="primary" size="lg" fullWidth>
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button variant="ghost" size="md" fullWidth>
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

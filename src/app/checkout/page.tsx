'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import './checkout.css';
import { useCart } from '@/context/CartContext';
import { createOrder, validateCoupon } from './actions';

export default function CheckoutPage() {
    const router = useRouter();
    const { items: cartItems, cartTotal, clearCart } = useCart();
    const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ id: string; code: string; discount: number } | null>(null);
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
    });

    const subtotal = cartTotal;
    const deliveryCharge = deliveryZone === 'inside' ? (subtotal >= 5000 ? 0 : 150) : 250;
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = Math.max(0, subtotal + deliveryCharge - discount);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponMessage(null);

        const result = await validateCoupon(couponCode, subtotal);
        if (result.success && result.coupon) {
            setAppliedCoupon({
                id: result.coupon.id,
                code: result.coupon.code,
                discount: result.coupon.discount
            });
            setCouponMessage({ type: 'success', text: `Coupon applied: ৳${result.coupon.discount} OFF` });
        } else {
            setAppliedCoupon(null);
            setCouponMessage({ type: 'error', text: result.error || 'Invalid coupon' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Submit triggered', { cartItems, formData });

        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            console.log('Creating order with data:', {
                ...formData,
                deliveryZone,
                items: cartItems,
                subtotal,
                deliveryCharge,
                discount,
                total
            });

            const result = await createOrder({
                customerName: formData.fullName,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                deliveryZone,
                notes: formData.notes,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size || 'N/A',
                    color: item.color
                })),
                subtotal,
                deliveryCharge,
                discount,
                total,
                paymentMethod: 'COD',
                couponId: appliedCoupon?.id
            });

            console.log('Order result:', result);

            if (result.success) {
                clearCart();
                router.push(`/checkout/success?orderId=${result.orderId}`);
            } else {
                alert(`Failed to place order: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Order error:', error);
            alert(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h1>Your cart is empty</h1>
                <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <form onSubmit={handleSubmit} className="checkout-grid">
                    {/* Checkout Form */}
                    <div className="checkout-form">
                        {/* Customer Information */}
                        <div className="form-section">
                            <h2 className="section-title">Customer Information</h2>
                            <div className="form-grid">
                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+880 1234-567890"
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your.email@example.com"
                                    className="full-width"
                                    required
                                />
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="form-section">
                            <h2 className="section-title">Delivery Address</h2>
                            <div className="form-grid">
                                <Input
                                    label="Street Address"
                                    placeholder="House/Flat, Street Name"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="full-width"
                                    required
                                />
                                <Input
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="City Name"
                                    required
                                />
                                <Input
                                    label="Postal Code"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="1234"
                                />
                                <div className="delivery-zone">
                                    <label className="zone-label">Delivery Zone</label>
                                    <div className="zone-options">
                                        <button
                                            type="button"
                                            className={`zone-btn ${deliveryZone === 'inside' ? 'active' : ''}`}
                                            onClick={() => setDeliveryZone('inside')}
                                        >
                                            <span>📍 Inside Dhaka</span>
                                            <span className="zone-charge">{subtotal >= 5000 ? 'FREE' : '150 BDT'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`zone-btn ${deliveryZone === 'outside' ? 'active' : ''}`}
                                            onClick={() => setDeliveryZone('outside')}
                                        >
                                            <span>🚚 Outside Dhaka</span>
                                            <span className="zone-charge">250 BDT</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="form-section">
                            <h2 className="section-title">Payment Method</h2>
                            <div className="payment-method">
                                <div className="cod-badge">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                        <path d="M2 17l10 5 10-5"></path>
                                        <path d="M2 12l10 5 10-5"></path>
                                    </svg>
                                    <div>
                                        <h3>Cash on Delivery</h3>
                                        <p>Pay when you receive your order at your doorstep</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Notes */}
                        <div className="form-section">
                            <h2 className="section-title">Order Notes (Optional)</h2>
                            <textarea
                                className="order-notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Any special instructions for delivery?"
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-sidebar">
                        <div className="summary-sticky">
                            <h2 className="summary-title">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="summary-items">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="summary-item">
                                        <div className="item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">
                                                {item.size} × {item.quantity}
                                            </span>
                                        </div>
                                        <span className="item-price">৳ {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code Input */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Input
                                        placeholder="Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={!!appliedCoupon}
                                    />
                                    <Button
                                        type="button"
                                        onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); setCouponMessage(null); } : handleApplyCoupon}
                                        variant="outline"
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {appliedCoupon ? 'Remove' : 'Apply'}
                                    </Button>
                                </div>
                                {couponMessage && (
                                    <div style={{
                                        fontSize: '0.875rem',
                                        marginTop: '0.5rem',
                                        color: couponMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'
                                    }}>
                                        {couponMessage.text}
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="summary-breakdown">
                                <div className="breakdown-row">
                                    <span>Subtotal</span>
                                    <span>৳ {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="breakdown-row">
                                    <span>Delivery Charge ({deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                                    <span>{deliveryCharge === 0 ? 'FREE' : `৳ ${deliveryCharge}`}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="breakdown-row" style={{ color: 'var(--color-success)' }}>
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>- ৳ {discount.toLocaleString()}</span>
                                    </div>
                                )}
                                {deliveryCharge === 0 && (
                                    <p className="free-delivery-note">🎉 You got free delivery!</p>
                                )}
                                <div className="summary-divider"></div>
                                <div className="breakdown-row total-row">
                                    <span>Total Amount</span>
                                    <span>৳ {total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <Button
                                type="submit"
                                variant="secondary"
                                size="lg"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Placing Order...' : 'Place Order (COD)'}
                            </Button>

                            {/* Trust Badges */}
                            <div className="trust-badges">
                                <div className="badge-item">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                                        <path d="M9 12l2 2 4-4"></path>
                                    </svg>
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="badge-item">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    </svg>
                                    <span>7-Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import './MobileNav.css';

export const MobileNav: React.FC = () => {
    const pathname = usePathname();
    const { cartCount } = useCart();

    // Only show on non-admin pages
    if (pathname?.startsWith('/admin')) return null;

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="mobile-nav">
            <div className="mobile-nav-container">
                <Link href="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Home</span>
                </Link>

                <Link href="/products" className={`mobile-nav-item ${isActive('/products') ? 'active' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    <span>Categories</span>
                </Link>

                <div className="mobile-nav-center">
                    <Link href="/cart" className={`mobile-cart-wrapper ${isActive('/cart') ? 'active' : ''}`}>
                        <div className="mobile-cart-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
                        </div>
                        <span className="cart-label">Cart ({cartCount})</span>
                    </Link>
                </div>

                <Link href="/orders" className={`mobile-nav-item ${isActive('/orders') ? 'active' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <span>Track Order</span>
                </Link>

                <Link href="/account" className={`mobile-nav-item ${isActive('/account') ? 'active' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Account</span>
                </Link>
            </div>
        </nav>
    );
};

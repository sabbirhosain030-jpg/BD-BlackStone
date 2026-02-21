'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CategoryModal } from './CategoryModal';
import { getCategories } from '@/app/actions';
import './MobileNav.css';

interface Category {
    id: string;
    name: string;
    slug: string;
    brand?: string | null;
    description?: string | null;
    subCategories?: { id: string; name: string; slug: string }[];
}

// Module-level cache so categories are only fetched once per session
let cachedCategories: Category[] = [];

const MobileNavComponent: React.FC = () => {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>(cachedCategories);

    // Fetch categories on mount — skips if already cached
    useEffect(() => {
        if (cachedCategories.length > 0) return;
        const fetchCategories = async () => {
            const cats = await getCategories();
            cachedCategories = cats;
            setCategories(cats);
        };
        fetchCategories();
    }, []);

    // Only show on non-admin pages
    if (pathname?.startsWith('/admin')) return null;

    const isActive = (path: string) => pathname === path;
    const isActivePath = (prefix: string) => pathname?.startsWith(prefix) ?? false;

    const handleCategoryClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(30);
        }
        setIsCategoryModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsCategoryModalOpen(false);
    }, []);

    return (
        <>
            <nav className="mobile-nav">
                <div className="mobile-nav-container">

                    {/* Home */}
                    <Link
                        href="/"
                        className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
                        prefetch={true}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span>Home</span>
                    </Link>

                    {/* Shop — opens popup with Shop All + categories */}
                    <button
                        onClick={handleCategoryClick}
                        className={`mobile-nav-item ${isActivePath('/products') ? 'active' : ''}`}
                        aria-label="Shop"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span>Shop</span>
                    </button>

                    {/* Cart — elevated center button */}
                    <div className="mobile-nav-center">
                        <Link
                            href="/cart"
                            className={`mobile-cart-wrapper ${isActive('/cart') ? 'active' : ''}`}
                            prefetch={true}
                        >
                            <div className="mobile-cart-btn">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="mobile-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                                )}
                            </div>
                            <span className="cart-label">Cart</span>
                        </Link>
                    </div>

                    {/* Track Orders — links to /account which shows admin-synced order statuses */}
                    <Link
                        href="/account"
                        className={`mobile-nav-item ${isActive('/account') && !isActivePath('/account/profile') ? 'active' : ''}`}
                        prefetch={true}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="1" y="3" width="15" height="13" rx="1" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                        <span>Track</span>
                    </Link>

                    {/* Account */}
                    <Link
                        href="/account"
                        className={`mobile-nav-item ${isActive('/account') || isActivePath('/orders') ? 'active' : ''}`}
                        prefetch={true}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Account</span>
                    </Link>

                </div>
            </nav>

            {/* Category Modal */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={handleCloseModal}
                categories={categories}
            />
        </>
    );
};

// Memoize to prevent unnecessary re-renders
export const MobileNav = memo(MobileNavComponent);

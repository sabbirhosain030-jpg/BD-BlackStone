'use client';

import React, { useState, useEffect } from 'react';
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
}

export const MobileNav: React.FC = () => {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const cats = await getCategories();
            setCategories(cats);
        };
        fetchCategories();
    }, []);

    // Only show on non-admin pages
    if (pathname?.startsWith('/admin')) return null;

    const isActive = (path: string) => pathname === path;

    const handleCategoryClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(30);
        }
        setIsCategoryModalOpen(true);
    };

    return (
        <>
            <nav className="mobile-nav">
                <div className="mobile-nav-container">
                    <Link href="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`} prefetch={true}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span>Home</span>
                    </Link>

                    <button
                        onClick={handleCategoryClick}
                        className={`mobile-nav-item ${pathname?.startsWith('/products') ? 'active' : ''}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        <span>Categories</span>
                    </button>

                    <div className="mobile-nav-center">
                        <Link href="/cart" className={`mobile-cart-wrapper ${isActive('/cart') ? 'active' : ''}`} prefetch={true}>
                            <div className="mobile-cart-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
                            </div>
                            <span className="cart-label">Cart</span>
                        </Link>
                    </div>

                    <Link href="/account" className={`mobile-nav-item ${isActive('/account') || pathname?.startsWith('/order') ? 'active' : ''}`} prefetch={true}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        <span>Track</span>
                    </Link>

                    <Link href="/account" className={`mobile-nav-item ${isActive('/account') ? 'active' : ''}`} prefetch={true}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Account</span>
                    </Link>
                </div>
            </nav>

            {/* Category Modal */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categories}
            />
        </>
    );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import './Header.css';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext'; // Restored

// Client-side wishlist badge component
function WishlistBadge() {
    const { wishlistCount } = useWishlist();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || wishlistCount === 0) return null;

    return (
        <span className="icon-badge">{wishlistCount}</span>
    );
}

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { cartCount } = useCart();
    const { data: session } = useSession();

    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="header-top">
                <div className="container">
                    <div className="header-top-content">
                        <span className="header-announcement">Free Shipping on Orders Over 5000 BDT</span>
                        <div className="header-links">
                            {session ? (
                                <>
                                    <span>Hi, {session.user?.name?.split(' ')[0]}</span>
                                    <button onClick={() => signOut()} className="text-btn">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">Login</Link>
                                    <Link href="/signup">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-main">
                <div className="container">
                    <div className="header-content">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className="menu-icon"></span>
                            <span className="menu-icon"></span>
                            <span className="menu-icon"></span>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="header-logo">
                            <img
                                src="/logo.jpg"
                                alt="BLACK STONE - Premium Professional Clothing"
                                style={{
                                    height: '70px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    maxWidth: '400px'
                                }}
                            />
                        </Link>

                        {/* Navigation */}
                        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                            <Link
                                href="/"
                                className={`nav-link ${pathname === '/' && !category && !tag ? 'nav-link-active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>

                            {/* Shop By Category Dropdown - ALL CATEGORIES WITH SUBCATEGORIES */}
                            <div className="nav-dropdown">
                                <Link
                                    href="/products"
                                    className={`nav-link ${pathname === '/products' && !category && !tag ? 'nav-link-active' : ''}`}
                                >
                                    Shop <span style={{ fontSize: '0.7em' }}>▼</span>
                                </Link>
                                <div className="nav-dropdown-menu">
                                    {/* MEN'S FASHION */}
                                    <Link href="/products?category=mens-fashion" className="dropdown-item dropdown-header">
                                        Men's Fashion
                                    </Link>
                                    <Link href="/products?subCategory=shirt" className="dropdown-subitem">
                                        → Shirt
                                    </Link>
                                    <Link href="/products?subCategory=pant" className="dropdown-subitem">
                                        → Pant
                                    </Link>
                                    <Link href="/products?subCategory=t-shirt" className="dropdown-subitem">
                                        → T-Shirt
                                    </Link>
                                    <Link href="/products?subCategory=panjabi" className="dropdown-subitem">
                                        → Panjabi
                                    </Link>

                                    {/* WOMEN'S FASHION */}
                                    <Link href="/products?category=womens-fashion" className="dropdown-item dropdown-header">
                                        Women's Fashion
                                    </Link>
                                    <Link href="/products?subCategory=dress" className="dropdown-subitem">
                                        → Dress
                                    </Link>
                                    <Link href="/products?subCategory=salwar" className="dropdown-subitem">
                                        → Salwar Kameez
                                    </Link>
                                    <Link href="/products?subCategory=saree" className="dropdown-subitem">
                                        → Saree
                                    </Link>
                                    <Link href="/products?subCategory=tops" className="dropdown-subitem">
                                        → Tops
                                    </Link>

                                    {/* BOYS */}
                                    <Link href="/products?category=boys" className="dropdown-item dropdown-header">
                                        Boys
                                    </Link>
                                    <Link href="/products?subCategory=boys-shirt" className="dropdown-subitem">
                                        → Shirts
                                    </Link>
                                    <Link href="/products?subCategory=boys-pant" className="dropdown-subitem">
                                        → Pants
                                    </Link>
                                    <Link href="/products?subCategory=boys-tshirt" className="dropdown-subitem">
                                        → T-Shirts
                                    </Link>

                                    {/* GIRLS */}
                                    <Link href="/products?category=girls" className="dropdown-item dropdown-header">
                                        Girls
                                    </Link>
                                    <Link href="/products?subCategory=girls-dress" className="dropdown-subitem">
                                        → Dresses
                                    </Link>
                                    <Link href="/products?subCategory=girls-tops" className="dropdown-subitem">
                                        → Tops
                                    </Link>
                                    <Link href="/products?subCategory=girls-skirts" className="dropdown-subitem">
                                        → Skirts
                                    </Link>

                                    <div className="dropdown-divider"></div>
                                    <Link href="/products" className="dropdown-item">
                                        View All Products
                                    </Link>
                                </div>
                            </div>

                            {/* Direct Category Links - RESTORED */}
                            <Link
                                href="/products?category=mens-fashion"
                                className={`nav-link ${category === 'mens-fashion' || category === 'men' ? 'nav-link-active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Men
                            </Link>
                            <Link
                                href="/products?category=womens-fashion"
                                className={`nav-link ${category === 'womens-fashion' || category === 'women' ? 'nav-link-active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Women
                            </Link>

                            {/* WISHLIST LINK */}
                            <Link
                                href="/wishlist"
                                className={`nav-link ${pathname === '/wishlist' ? 'nav-link-active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Wishlist
                            </Link>

                            <Link
                                href="/products?tag=new"
                                className={`nav-link ${tag === 'new' ? 'nav-link-active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                New Arrivals
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="header-actions">
                            <button
                                className="action-btn"
                                onClick={() => setSearchOpen(!searchOpen)}
                                aria-label="Search"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>

                            <Link href={session ? "/account" : "/login"} className="action-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </Link>

                            {/* Wishlist Button */}
                            <Link href="/wishlist" className="action-btn" title="Wishlist">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <WishlistBadge />
                            </Link>

                            <Link href="/cart" className="action-btn cart-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 2 7 6H2l3 14h14l3-14h-5L15 2z"></path>
                                </svg>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {
                searchOpen && (
                    <div className="search-bar">
                        <div className="container">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="search-input"
                                autoFocus
                            />
                            <button
                                className="search-close"
                                onClick={() => setSearchOpen(false)}
                                aria-label="Close search"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )
            }
        </header >
    );
};

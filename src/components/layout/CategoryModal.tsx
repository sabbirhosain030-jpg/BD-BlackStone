'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import './CategoryModal.css';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories?: unknown[]; // kept for API compatibility, not used
}

// Fixed 2x2 category grid — direct links, prefetched for instant response
const SHOP_CATEGORIES = [
    {
        id: 'men',
        label: 'Men',
        href: '/products?category=men',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
            </svg>
        ),
    },
    {
        id: 'boys',
        label: 'Boys',
        href: '/products?category=boys',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="3" />
                <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
                <path d="M12 11v5" strokeLinecap="round" />
                <path d="M15 17l-3 3-3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: 'women',
        label: 'Women',
        href: '/products?category=women',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="7" r="4" />
                <path d="M12 11v9" strokeLinecap="round" />
                <path d="M9 17h6" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: 'girls',
        label: 'Girls',
        href: '/products?category=girls',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="7" r="3" />
                <path d="M12 10v7" strokeLinecap="round" />
                <path d="M9 14h6" strokeLinecap="round" />
                <path d="M10 17l2 3 2-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

const CategoryModalComponent: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
    const handleClose = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="category-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        onClick={handleClose}
                    />

                    {/* Modal sheet */}
                    <motion.div
                        className="category-modal"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                    >
                        {/* Header */}
                        <div className="category-modal-header">
                            <h2 className="category-modal-title">Shop</h2>
                            <button className="category-modal-close" onClick={handleClose} aria-label="Close">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Shop All — gold banner */}
                        <div className="category-shop-all-wrap">
                            <Link
                                href="/products"
                                className="category-shop-all-btn"
                                onClick={handleClose}
                                prefetch={true}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                <span>Shop All Products</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </Link>
                        </div>

                        {/* Section label */}
                        <div className="category-section-label">Shop By Category</div>

                        {/* 2 × 2 Category Grid */}
                        <div className="category-2x2-grid">
                            {SHOP_CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.href}
                                    className="category-2x2-item"
                                    onClick={handleClose}
                                    prefetch={true}
                                >
                                    <div className="category-2x2-icon">{cat.icon}</div>
                                    <span className="category-2x2-label">{cat.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export const CategoryModal = memo(CategoryModalComponent);

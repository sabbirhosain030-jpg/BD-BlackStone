'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import './CategoryModal.css';

interface Category {
    id: string;
    name: string;
    slug: string;
    brand?: string | null;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

const CategoryModalComponent: React.FC<CategoryModalProps> = ({ isOpen, onClose, categories }) => {
    const [selectedGender, setSelectedGender] = React.useState<'men' | 'women'>('men');

    // Memoize category filtering to prevent recalculation
    const { menCategories, womenCategories } = useMemo(() => {
        const men = categories.filter(c =>
            (c.slug === 'men' || c.slug === 'boys') && c.brand === 'BLACK STONE'
        );
        const women = categories.filter(c =>
            (c.slug === 'women' || c.slug === 'girls') && c.brand === 'GAZZELLE'
        );
        return { menCategories: men, womenCategories: women };
    }, [categories]);

    const displayCategories = selectedGender === 'men' ? menCategories : womenCategories;

    const handleCategoryClick = () => {
        // Instant close with vibration feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(30);
        }
        onClose();
    };

    // Simplified animations for better performance on low-end devices
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { y: '100%' },
        visible: { y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="category-modal-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.1 }}  /* Ultra-fast backdrop for instant feel */
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="category-modal"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            mass: 0.8
                        }}  /* Spring animation for snappy feel */
                    >
                        {/* Header */}
                        <div className="category-modal-header">
                            <h2 className="category-modal-title">Shop By Category</h2>
                            <button
                                className="category-modal-close"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Gender Toggle */}
                        <div className="category-gender-toggle">
                            <button
                                className={`gender-toggle-btn ${selectedGender === 'men' ? 'active' : ''}`}
                                onClick={() => setSelectedGender('men')}
                            >
                                Men & Boys
                            </button>
                            <button
                                className={`gender-toggle-btn ${selectedGender === 'women' ? 'active' : ''}`}
                                onClick={() => setSelectedGender('women')}
                            >
                                Women & Girls
                            </button>
                        </div>

                        {/* Category Grid */}
                        <div className="category-grid">
                            {displayCategories.length > 0 ? (
                                displayCategories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/products?category=${category.slug}`}
                                        className="category-grid-item"
                                        onClick={handleCategoryClick}
                                    >
                                        <div className="category-item-content">
                                            <span className="category-item-name">{category.name}</span>
                                            {category.brand && (
                                                <span className="category-item-brand">{category.brand}</span>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="category-empty">
                                    <p>No categories available</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Memoize to prevent unnecessary re-renders
export const CategoryModal = memo(CategoryModalComponent);

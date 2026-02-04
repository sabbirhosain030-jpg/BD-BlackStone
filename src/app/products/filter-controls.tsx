'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Category = {
    id: string;
    name: string;
    slug: string;
    brand?: string | null;
};

export default function FilterControls({
    categories,
    currentCategory,
    currentSort,
    currentPrice
}: {
    categories: Category[],
    currentCategory?: string,
    currentSort?: string,
    currentPrice?: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`);
    };

    const handleClearFilters = () => {
        // Keep view mode if set, clear everything else
        const viewMode = searchParams.get('view');
        if (viewMode) {
            router.push(`/products?view=${viewMode}`);
        } else {
            router.push('/products');
        }
    };

    const hasActiveFilters = currentCategory || currentPrice || (currentSort && currentSort !== 'newest');

    return (
        <div className="products-toolbar">
            {/* Mobile Filter Toggle */}
            <button
                className="mobile-filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
                <span>Filters</span>
                {hasActiveFilters && <span className="filter-badge"></span>}
            </button>

            <div className={`filters ${showFilters ? 'show' : ''}`}>
                {/* Category Filter */}
                <div className="filter-group">
                    <label htmlFor="category-filter" className="filter-label">Category</label>
                    <select
                        id="category-filter"
                        className="filter-select"
                        value={currentCategory || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {(() => {
                            const blackStone = categories.filter(c => c.brand === 'BLACK STONE');
                            const gazzelle = categories.filter(c => c.brand === 'GAZZELLE');
                            const others = categories.filter(c => !c.brand || (c.brand !== 'BLACK STONE' && c.brand !== 'GAZZELLE'));

                            return (
                                <>
                                    {blackStone.length > 0 && (
                                        <optgroup label="BLACK STONE">
                                            {blackStone.map(cat => (
                                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                            ))}
                                        </optgroup>
                                    )}
                                    {gazzelle.length > 0 && (
                                        <optgroup label="GAZZELLE">
                                            {gazzelle.map(cat => (
                                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                            ))}
                                        </optgroup>
                                    )}
                                    {others.length > 0 && others.map(cat => (
                                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                    ))}
                                </>
                            );
                        })()}
                    </select>
                </div>

                {/* Price Filter */}
                <div className="filter-group">
                    <label htmlFor="price-filter" className="filter-label">Price Range</label>
                    <select
                        id="price-filter"
                        className="filter-select"
                        value={currentPrice || ''}
                        onChange={(e) => handleFilterChange('price', e.target.value)}
                    >
                        <option value="">All Prices</option>
                        <option value="0-5000">Under 5,000 BDT</option>
                        <option value="5000-10000">5,000 - 10,000 BDT</option>
                        <option value="10000+">Over 10,000 BDT</option>
                    </select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        className="clear-filters-btn"
                        onClick={handleClearFilters}
                        title="Clear all filters"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="sort">
                {/* View Toggles */}
                <div className="view-toggles">
                    <button
                        className={`view-btn ${(!searchParams.get('view') || searchParams.get('view') === 'grid') ? 'active' : ''}`}
                        onClick={() => handleFilterChange('view', 'grid')}
                        title="Grid View"
                        aria-label="Grid view"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                    <button
                        className={`view-btn ${searchParams.get('view') === 'list' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('view', 'list')}
                        title="List View"
                        aria-label="List view"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Sort Dropdown */}
                <div className="filter-group">
                    <label htmlFor="sort-filter" className="filter-label">Sort By</label>
                    <select
                        id="sort-filter"
                        className="filter-select"
                        value={currentSort || 'newest'}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

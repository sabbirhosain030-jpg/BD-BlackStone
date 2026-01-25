'use client';

import React from 'react';
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

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset to page 1 if we had pagination (omitted for now)
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="products-toolbar">
            <div className="filters">
                {/* Category Filter */}
                <select
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

                {/* Price Filter */}
                <select
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

            <div className="sort" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* View Toggles */}
                <div className="view-toggles" style={{ display: 'flex', gap: '0.5rem', borderRight: '1px solid #eee', paddingRight: '1rem' }}>
                    <button
                        className={`view-btn ${(!searchParams.get('view') || searchParams.get('view') === 'grid') ? 'active' : ''}`}
                        onClick={() => handleFilterChange('view', 'grid')}
                        title="Grid View"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: (!searchParams.get('view') || searchParams.get('view') === 'grid') ? '#d4af37' : '#999' }}
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
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: searchParams.get('view') === 'list' ? '#d4af37' : '#999' }}
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

                {/* Sort Filter */}
                <select
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
    );
}

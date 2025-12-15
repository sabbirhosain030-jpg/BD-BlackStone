'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Category = {
    id: string;
    name: string;
    slug: string;
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
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
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

            <div className="sort">
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

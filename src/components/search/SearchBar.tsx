'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './SearchBar.css';

interface SearchResult {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
}

export default function DynamicSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.products || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (productId: string) => {
        router.push(`/products/${productId}`);
        setQuery('');
        setIsOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="search-input"
                />
                <button type="submit" className="search-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </form>

            {/* Search Results Dropdown */}
            {isOpen && (
                <>
                    <div className="search-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="search-results">
                        {loading ? (
                            <div className="search-loading">Searching...</div>
                        ) : results.length > 0 ? (
                            results.map((product) => (
                                <div
                                    key={product.id}
                                    className="search-result-item"
                                    onClick={() => handleSelect(product.id)}
                                >
                                    <img src={product.image} alt={product.name} className="result-image" />
                                    <div className="result-info">
                                        <div className="result-name">{product.name}</div>
                                        <div className="result-meta">
                                            {product.category} • ৳{product.price}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="search-empty">No results found for "{query}"</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

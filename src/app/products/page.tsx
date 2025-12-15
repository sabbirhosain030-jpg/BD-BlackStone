import React from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import './products.css';
import { getAllProducts, getCategories } from '../actions';
import FilterControls from './filter-controls';

// This is a Server Component that receives searchParams
export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; sort?: string; price?: string; tag?: string }>;
}) {
    const resolvedParams = await searchParams; // Await the promise
    const categoryFilter = resolvedParams.category;
    const sortFilter = resolvedParams.sort || 'newest';
    const tagFilter = resolvedParams.tag; // 'new'

    // Parse price range from string "0-5000"
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    if (resolvedParams.price) {
        if (resolvedParams.price === '10000+') {
            minPrice = 10000;
        } else {
            const parts = resolvedParams.price.split('-');
            if (parts.length === 2) {
                minPrice = parseInt(parts[0]);
                maxPrice = parseInt(parts[1]);
            }
        }
    }

    // Fetch data
    const products = await getAllProducts(categoryFilter, sortFilter, minPrice, maxPrice);
    const categories = await getCategories();

    // Map DB products to ProductCard props
    const mappedProducts = products.map(p => {
        let imageUrl = '/placeholder.png';
        try {
            const images = JSON.parse(p.images);
            if (Array.isArray(images) && images.length > 0) imageUrl = images[0];
        } catch (e) { }

        return {
            id: p.id,
            name: p.name,
            price: p.price,
            previousPrice: p.previousPrice || undefined,
            image: imageUrl,
            category: p.category.name,
            isNew: p.isNew
        };
    });

    // Handle "New Arrivals" tag filter separately if needed, or pass it to getAllProducts
    // For now, if tag=new, we might filter comfortably in JS or pass another param.
    // Let's filter in JS for simplicity if `tag=new` is present, 
    // though ideally it should be in the DB query.
    let displayedProducts = mappedProducts;
    if (tagFilter === 'new') {
        displayedProducts = displayedProducts.filter(p => p.isNew);
    }

    return (
        <div className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">
                        {categoryFilter
                            ? `${categories.find(c => c.slug === categoryFilter)?.name || categoryFilter} Collection`
                            : 'All Products'}
                    </h1>
                    <p className="page-description">
                        Browse our complete collection of premium professional clothing
                    </p>
                </div>

                {/* Filters and Sort (Client Component) */}
                <FilterControls
                    categories={categories}
                    currentCategory={categoryFilter}
                    currentSort={sortFilter}
                    currentPrice={resolvedParams.price}
                />

                {/* Products Grid */}
                <div className="products-grid">
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                            <p style={{ fontSize: '1.2rem', color: '#666' }}>No products found matching your filters.</p>
                            <a href="/products" style={{ color: 'var(--color-gold)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
                                Clear Filters
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

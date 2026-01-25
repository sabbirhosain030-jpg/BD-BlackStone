import React from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryPills } from '@/components/products/CategoryPills';
import './products.css';
import { getAllProducts, getCategories } from '../actions';
import FilterControls from './filter-controls';

// ISR: Regenerate every 60 seconds, allow dynamic filter params
export const revalidate = 60;
export const dynamicParams = true;

// This is a Server Component that receives searchParams
export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; subCategory?: string; sort?: string; price?: string; tag?: string; view?: 'grid' | 'list' }>;
}) {
    const resolvedParams = await searchParams; // Await the promise
    const categoryFilter = resolvedParams.category;
    const subCategoryFilter = resolvedParams.subCategory;
    const sortFilter = resolvedParams.sort || 'newest';
    const tagFilter = resolvedParams.tag; // 'new'
    const viewMode = resolvedParams.view || 'grid';

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
    const products = await getAllProducts(categoryFilter, sortFilter, minPrice, maxPrice, subCategoryFilter);
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
                    <h1 className="page-title collection-title">
                        {(() => {
                            const selectedCategory = categories.find(c => c.slug === categoryFilter);
                            if (selectedCategory) {
                                return selectedCategory.brand || selectedCategory.name;
                            }
                            return 'All Products';
                        })()}
                    </h1>
                    <p className="page-description">
                        {(() => {
                            const selectedCategory = categories.find(c => c.slug === categoryFilter);
                            if (!selectedCategory) return 'Browse our complete collection of premium clothing';

                            const brand = selectedCategory.brand;
                            if (brand === 'GAZZELLE') {
                                return selectedCategory.name.toLowerCase().includes('girl')
                                    ? 'Beautiful styles for young girls'
                                    : 'Elegant collection for modern women';
                            } else if (brand === 'BLACK STONE') {
                                return selectedCategory.name.toLowerCase().includes('boy')
                                    ? 'Stylish collection for boys'
                                    : 'Premium professional clothing for men';
                            }
                            return `Explore our ${selectedCategory.name} collection`;
                        })()}
                    </p>
                </div>

                {/* Filters and Sort (Client Component) */}
                <FilterControls
                    categories={categories}
                    currentCategory={categoryFilter}
                    currentSort={sortFilter}
                    currentPrice={resolvedParams.price}
                />

                {/* Sub-Category Pills */}
                <CategoryPills
                    categories={categories}
                    currentCategory={categoryFilter}
                />

                {/* Products Grid */}
                <div className={viewMode === 'list' ? "products-list" : "products-grid"}>
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => (
                            <ProductCard key={product.id} {...product} variant={viewMode} />
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

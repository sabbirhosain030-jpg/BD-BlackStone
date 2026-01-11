import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import './page.css';
import { getFeaturedProducts, getCategories } from '@/app/actions';
import { getMarketingBanners } from '@/app/admin/actions';
import OfferPoster from "@/components/layout/OfferPoster";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featuredDbProducts = await getFeaturedProducts();
  const dbCategories = await getCategories();

  // Map DB products to ProductCard props
  const featuredProducts = featuredDbProducts.map(p => {
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
      category: 'Collection', // We can fetch category name if needed, or generic
      isNew: p.isNew
    };
  });

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image-wrapper">
          <Image
            src="/hero_fashion_1765713862724.png"
            alt="BD BlackStone Fashion"
            fill
            priority
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title animate-slide-up">
                Timeless Elegance
                <span className="hero-subtitle">For The Modern Professional</span>
              </h1>
              <p className="hero-description animate-slide-up delay-200">
                Discover our curated collection of premium professional clothing.
                Classic designs crafted with exceptional quality.
              </p>
              <div className="hero-actions animate-slide-up delay-300">
                <Link href="/products">
                  <Button size="lg" variant="primary" className="btn-pulse">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/products?tag=new">
                  <Button size="lg" variant="outline">
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Shop By Category</h2>
            <p className="section-description">
              Curated collections for every professional wardrobe
            </p>
          </div>
          <div className="categories-grid categories-circular">
            {dbCategories.length > 0 ? (
              dbCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="category-circle-item hover-lift"
                >
                  <div className="category-circle-image-wrapper">
                    <Image
                      src={
                        category.name.toLowerCase().includes('men') && !category.name.toLowerCase().includes('wo') ? '/mens_suit_1_1765713791170.png' :
                          category.name.toLowerCase().includes('women') ? '/womens_blazer_1_1765713823996.png' :
                            '/hero_fashion_1765713862724.png'
                      }
                      alt={category.name}
                      fill
                      className="category-circle-image"
                    />
                  </div>
                  <h3 className="category-circle-name">{category.name}</h3>
                </Link>
              ))
            ) : (
              <p className="text-center">No categories found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-description">
              Handpicked essentials for the discerning professional
            </p>
          </div>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <p className="text-center">No featured products yet.</p>
            )}
          </div>
          <div className="section-cta">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="features-grid">
            <div className="feature hover-lift">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="feature-title">Cash on Delivery</h3>
              <p className="feature-description">
                Pay when you receive your order at your doorstep
              </p>
            </div>
            <div className="feature hover-lift">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-description">
                On orders over 5,000 BDT across Bangladesh
              </p>
            </div>
            <div className="feature hover-lift">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 className="feature-title">Easy Returns</h3>
              <p className="feature-description">
                7-day hassle-free return & exchange policy
              </p>
            </div>
            <div className="feature hover-lift">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">
                Carefully curated professional clothing that lasts
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import './product-detail.css';
import { getProductById } from '../../actions';
import ProductView from '@/components/products/ProductView';
import { prisma } from '@/lib/prisma';

// ISR: Regenerate every 60 seconds, allow new products not in generateStaticParams
export const revalidate = 60;
export const dynamicParams = true;

// Pre-render top products at build time for maximum speed
export async function generateStaticParams() {
    try {
        const products = await prisma.product.findMany({
            select: { id: true },
            take: 100, // Pre-render top 100 products
            orderBy: { createdAt: 'desc' }
        });

        return products.map((product) => ({
            id: product.id,
        }));
    } catch (error) {
        console.error('Failed to generate static params:', error);
        return [];
    }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const dbProduct = await getProductById(id);

    if (!dbProduct) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h1>Product Not Found</h1>
                <Link href="/products" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>
                    Return to Products
                </Link>
            </div>
        );
    }

    // Transform DB data to View props
    let images: string[] = [];
    try {
        const parsed = JSON.parse(dbProduct.images);
        if (Array.isArray(parsed)) images = parsed;
    } catch (e) {
        // Fallback for single legacy url or error
        images = ['/placeholder.png'];
    }

    let sizes: string[] = [];
    try {
        const parsed = JSON.parse(dbProduct.sizes || '[]');
        if (Array.isArray(parsed)) sizes = parsed;
    } catch (e) { }

    const product = {
        id: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        previousPrice: dbProduct.previousPrice,
        description: dbProduct.description,
        images: images.length > 0 ? images : ['/placeholder.png'],
        sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'], // Default if missing
        category: dbProduct.category?.name || 'Collection',
        stock: dbProduct.stock
    };

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/products">Products</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                <ProductView product={product} />
            </div>
        </div>
    );
}

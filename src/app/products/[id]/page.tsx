import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import './product-detail.css';
import { getProductById } from '../../actions';
import ProductView from '@/components/products/ProductView';
import { prisma } from '@/lib/prisma';

// ISR: Regenerate every 60 seconds, allow new products not in generateStaticParams
export const revalidate = 60;
export const dynamicParams = true;

// Generate Dynamic Metadata for SEO & Facebook Open Graph
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            name: true,
            description: true,
            price: true,
            images: true,
        }
    });

    if (!product) {
        return {
            title: 'Product Not Found | Black Stone',
            description: 'The requested product could not be found.'
        };
    }

    let imageUrl = '/placeholder.png';
    try {
        const parsedImages = JSON.parse(product.images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            imageUrl = parsedImages[0];
        }
    } catch (e) { }

    // Ensure absolute URL for images (required by FB)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bdblackstone.com';
    const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`;

    return {
        title: `${product.name} | Black Stone`,
        description: product.description || `Buy ${product.name} for ${product.price} BDT`,
        openGraph: {
            title: product.name,
            description: product.description,
            url: `${siteUrl}/products/${id}`,
            siteName: 'Black Stone BD',
            images: [
                {
                    url: absoluteImageUrl,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: [absoluteImageUrl],
        },
    };
}

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

    let colors: string[] = [];
    try {
        const parsed = JSON.parse(dbProduct.colors || '[]');
        if (Array.isArray(parsed)) colors = parsed;
    } catch (e) { }

    const product = {
        id: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        previousPrice: dbProduct.previousPrice,
        description: dbProduct.description,
        images: images.length > 0 ? images : ['/placeholder.png'],
        sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'], // Default if missing
        colors: colors.length > 0 ? colors : [], // Default empty if missing
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

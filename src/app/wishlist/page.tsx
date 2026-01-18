import React from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import './wishlist.css';

export default async function WishlistPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <div className="wishlist-empty">
                        <h1>My Wishlist</h1>
                        <p>Please login to view your wishlist</p>
                        <Link href="/login" className="btn-primary">Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            wishlists: {
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    const wishlistProducts = user?.wishlists.map(w => {
        const p = w.product;
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
    }) || [];

    return (
        <div className="wishlist-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">My Wishlist</h1>
                    <p className="page-description">
                        {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistProducts.length > 0 ? (
                    <div className="products-grid">
                        {wishlistProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="wishlist-empty">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2>Your wishlist is empty</h2>
                        <p>Save items you love for later</p>
                        <Link href="/products" className="btn-primary">Start Shopping</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

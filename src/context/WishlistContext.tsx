'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface WishlistContextType {
    wishlistItems: string[]; // Product IDs
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Load wishlist from server when user logs in
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            loadWishlist();
        } else if (status === 'unauthenticated') {
            setWishlistItems([]);
            setLoading(false);
        }
    }, [session, status]);

    const loadWishlist = async () => {
        try {
            const res = await fetch('/api/wishlist');
            if (res.ok) {
                const data = await res.json();
                setWishlistItems(data.productIds || []);
            }
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId: string) => {
        if (!session?.user) {
            // Check if we have a custom storage in future, for now alert
            const shouldLogin = confirm('Please login to add items to your wishlist. Go to login page?');
            if (shouldLogin) {
                window.location.href = '/login';
            }
            return;
        }

        // Optimistic update
        const prevItems = [...wishlistItems];
        if (!wishlistItems.includes(productId)) {
            setWishlistItems(prev => [...prev, productId]);
        }

        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });

            if (!res.ok) {
                throw new Error('Failed to add');
            }
        } catch (error) {
            setWishlistItems(prevItems);
            console.error('Failed to add to wishlist:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        // Optimistic update
        const prevItems = [...wishlistItems];
        setWishlistItems(prev => prev.filter(id => id !== productId));

        try {
            const res = await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Failed to remove');
            }
        } catch (error) {
            setWishlistItems(prevItems);
            console.error('Failed to remove from wishlist:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.includes(productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                wishlistCount: wishlistItems.length
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);

    // Safe fallback for SSR/build - return empty defaults
    if (context === undefined) {
        return {
            wishlistItems: [],
            wishlistCount: 0,
            isInWishlist: () => false,
            addToWishlist: async () => { },
            removeFromWishlist: async () => { }
        };
    }

    return context;
}


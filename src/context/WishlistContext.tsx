'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('bd-blackstone-wishlist');
        if (stored) {
            try {
                setWishlist(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse wishlist:', e);
            }
        }
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('bd-blackstone-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlist(prev => {
            if (prev.some(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlist.some(item => item.id === id);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
}

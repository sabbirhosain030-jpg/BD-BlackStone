'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string;
    color?: string;
    quantity: number;
};

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string, size: string, color?: string) => void;
    updateQuantity: (id: string, size: string, color: string | undefined, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setItems(prev => {
            const existingItemIndex = prev.findIndex(
                item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
            );

            const quantityToAdd = newItem.quantity || 1;

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const newItems = [...prev];
                newItems[existingItemIndex].quantity += quantityToAdd;
                return newItems;
            } else {
                // Add new item
                return [...prev, { ...newItem, quantity: quantityToAdd }];
            }
        });
    };

    const removeFromCart = (id: string, size: string, color?: string) => {
        setItems(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
    };

    const updateQuantity = (id: string, size: string, color: string | undefined, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev =>
            prev.map(item =>
                (item.id === id && item.size === size && item.color === color)
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

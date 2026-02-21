/**
 * Facebook Pixel Helper — fpixel.ts
 * Safe wrapper around window.fbq so events can be fired from any client component.
 */

declare global {
    interface Window {
        fbq?: (
            action: string,
            event: string,
            params?: Record<string, unknown>
        ) => void;
    }
}

/** Fire a standard Facebook Pixel event */
export const event = (name: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', name, params);
    }
};

// ── Standard E-commerce Events ──────────────────────────────────

/**
 * ViewContent — fire when a product detail page is viewed.
 */
export const viewContent = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    imageUrl?: string;
}) => {
    event('ViewContent', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        content_category: product.category ?? 'Fashion',
        value: product.price,
        currency: 'BDT',
    });
};

/**
 * AddToCart — fire when a user adds a product to the cart.
 */
export const addToCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    category?: string;
}) => {
    event('AddToCart', {
        content_ids: [product.id],
        content_name: product.name,
        content_type: 'product',
        value: product.price * (product.quantity ?? 1),
        currency: 'BDT',
        num_items: product.quantity ?? 1,
    });
};

/**
 * InitiateCheckout — fire when the user navigates to checkout.
 */
export const initiateCheckout = (params: {
    value: number;
    numItems: number;
}) => {
    event('InitiateCheckout', {
        value: params.value,
        currency: 'BDT',
        num_items: params.numItems,
    });
};

/**
 * Purchase — fire when an order is placed successfully.
 */
export const purchase = (params: {
    orderId: string;
    value: number;
    numItems: number;
}) => {
    event('Purchase', {
        value: params.value,
        currency: 'BDT',
        content_type: 'product',
        order_id: params.orderId,
        num_items: params.numItems,
    });
};

/**
 * Search — fire when the user searches for products.
 */
export const search = (searchTerm: string) => {
    event('Search', { search_string: searchTerm });
};

/**
 * WhatsApp Integration Utilities
 * Generates WhatsApp deep links for order notifications
 */

import { prisma } from '@/lib/prisma';

interface OrderItem {
    productId: string;
    product: {
        name: string;
    };
    quantity: number;
    price: number;
    size?: string | null;
    color?: string | null;
}

interface WhatsAppOrderData {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    deliveryZone: string;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    paymentMethod: string;
    notes?: string | null;
}

/**
 * Get WhatsApp business phone from settings
 */
async function getBusinessPhone(): Promise<string> {
    try {
        const settings = await prisma.whatsAppSettings.findFirst();
        return settings?.businessPhone || '8801XXXXXXXXX';
    } catch (error) {
        console.error('Failed to fetch WhatsApp settings:', error);
        return '8801XXXXXXXXX';
    }
}

/**
 * Generates a WhatsApp link with pre-filled order message including product URLs
 */
export async function generateWhatsAppOrderLink(order: WhatsAppOrderData): Promise<string> {
    const businessPhone = await getBusinessPhone();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const message = `
🛍️ *New Order from BD BlackStone*

📋 *Order Details*
Order Number: ${order.orderNumber}

👤 *Customer Information*
Name: ${order.customerName}
Phone: ${order.customerPhone}
Address: ${order.shippingAddress}, ${order.city}
Delivery Zone: ${order.deliveryZone}

📦 *Items Ordered*
${order.items.map((item, index) => {
        const variant = [item.size, item.color].filter(Boolean).join(', ');
        const productUrl = `${siteUrl}/products/${item.productId}`;
        return `${index + 1}. ${item.product.name}${variant ? ` (${variant})` : ''}
   Quantity: ${item.quantity}
   Price: ৳${item.price.toLocaleString()}
   🔗 View: ${productUrl}`;
    }).join('\n\n')}

💰 *Payment Summary*
Subtotal: ৳${order.subtotal.toLocaleString()}
Delivery: ৳${order.deliveryCharge.toLocaleString()}${order.discount > 0 ? `\nDiscount: -৳${order.discount.toLocaleString()}` : ''}
*Total: ৳${order.total.toLocaleString()}*

💳 Payment Method: ${order.paymentMethod}${order.notes ? `\n\n📝 Notes: ${order.notes}` : ''}

---
Thank you for shopping with BD BlackStone! 🖤
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${businessPhone}?text=${encodedMessage}`;
}

/**
 * Generates a simple customer support WhatsApp link
 */
export async function generateSupportWhatsAppLink(message?: string): Promise<string> {
    const businessPhone = await getBusinessPhone();
    const defaultMessage = 'Hello, I need assistance with my order.';
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    return `https://wa.me/${businessPhone}?text=${encodedMessage}`;
}


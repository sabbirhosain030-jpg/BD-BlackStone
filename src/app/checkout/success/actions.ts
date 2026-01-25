'use server';

import { prisma } from '@/lib/prisma';
import { generateWhatsAppOrderLink } from '@/lib/whatsapp';

/**
 * Fetch order details and generate WhatsApp link
 */
export async function getOrderWithWhatsAppLink(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Generate WhatsApp link with product URLs
        const whatsappLink = await generateWhatsAppOrderLink({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            shippingAddress: order.shippingAddress,
            city: order.city,
            deliveryZone: order.deliveryZone,
            items: order.items.map(item => ({
                productId: item.productId,
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color
            })),
            subtotal: order.subtotal,
            deliveryCharge: order.deliveryCharge,
            discount: order.discount,
            total: order.total,
            paymentMethod: order.paymentMethod,
            notes: order.notes
        });

        return {
            success: true,
            order: {
                ...order,
                items: order.items.map(item => ({
                    ...item,
                    product: {
                        name: item.product.name,
                        category: item.product.category?.name || 'Uncategorized',
                        brand: item.product.category?.brand || 'BLACK STONE'
                    }
                }))
            },
            whatsappLink
        };

    } catch (error) {
        console.error('Failed to fetch order:', error);
        return { success: false, error: 'Failed to fetch order details' };
    }
}

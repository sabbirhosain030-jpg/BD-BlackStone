'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

type OrderItemInput = {
    productId: string;
    quantity: number;
    price: number;
    size: string;
    color?: string;
};

type CreateOrderInput = {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    postalCode?: string;
    deliveryZone: 'inside' | 'outside';
    notes?: string;
    items: OrderItemInput[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    paymentMethod: string;
    couponId?: string;
};

export async function validateCoupon(code: string, subtotal: number) {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return { success: false, error: 'Invalid coupon code' };
        }

        if (!coupon.isActive) {
            return { success: false, error: 'Coupon is inactive' };
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return { success: false, error: 'Coupon has expired' };
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return { success: false, error: 'Coupon usage limit reached' };
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'FIXED') {
            discountAmount = coupon.amount;
        } else {
            discountAmount = (subtotal * coupon.amount) / 100;
        }

        // Cap discount at subtotal
        if (discountAmount > subtotal) discountAmount = subtotal;

        return {
            success: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                discount: discountAmount,
                type: coupon.discountType
            }
        };

    } catch (error) {
        return { success: false, error: 'Error validating coupon' };
    }
}

export async function createOrder(data: CreateOrderInput) {
    console.log('[SERVER] createOrder called with:', JSON.stringify(data, null, 2));

    if (!data.items || data.items.length === 0) {
        console.error('[SERVER] No items in order');
        return { success: false, error: 'No items in order' };
    }

    // Validate required fields
    if (!data.customerName || !data.customerEmail || !data.customerPhone || !data.shippingAddress || !data.city) {
        console.error('[SERVER] Missing required fields');
        return { success: false, error: 'Missing required customer information' };
    }

    // Generate specific Order Number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log('[SERVER] Generated order number:', orderNumber);

    try {
        let createdOrder: any = null;

        await prisma.$transaction(async (tx) => {
            console.log('[SERVER] Starting transaction');

            // Verify products exist
            for (const item of data.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }
                console.log(`[SERVER] Product verified: ${product.name}`);
            }

            const order = await tx.order.create({
                data: {
                    orderNumber,
                    customerName: data.customerName,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    shippingAddress: data.shippingAddress,
                    city: data.city,
                    postalCode: data.postalCode || '',
                    deliveryZone: data.deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
                    deliveryCharge: data.deliveryCharge,
                    subtotal: data.subtotal,
                    discount: data.discount,
                    total: data.total,
                    status: 'PENDING',
                    paymentMethod: data.paymentMethod,
                    notes: data.notes || '',
                    couponId: data.couponId || null,
                    items: {
                        create: data.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            size: item.size || 'N/A',
                            color: item.color || null
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            console.log('[SERVER] Order created successfully:', order.id);
            createdOrder = order;

            if (data.couponId) {
                await tx.coupon.update({
                    where: { id: data.couponId },
                    data: { usedCount: { increment: 1 } }
                });
                console.log('[SERVER] Coupon usage updated');
            }
        });

        revalidatePath('/admin/orders');
        console.log('[SERVER] Order creation complete, returning success');

        // Return order data for WhatsApp link generation (done on client side)
        return {
            success: true,
            orderId: createdOrder.id,
            orderNumber: createdOrder.orderNumber
        };

    } catch (error) {
        console.error('[SERVER] Failed to create order - Full error:', error);
        console.error('[SERVER] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            success: false,
            error: `Order creation failed: ${errorMessage}`
        };
    }
}


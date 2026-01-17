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
    if (!data.items || data.items.length === 0) {
        throw new Error('No items in order');
    }

    // Generate specific Order Number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
        let createdOrder: any = null;

        await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    customerName: data.customerName,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    shippingAddress: data.shippingAddress,
                    city: data.city,
                    postalCode: data.postalCode,
                    deliveryZone: data.deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
                    deliveryCharge: data.deliveryCharge,
                    subtotal: data.subtotal,
                    discount: data.discount,
                    total: data.total,
                    status: 'PENDING',
                    paymentMethod: data.paymentMethod,
                    notes: data.notes,
                    couponId: data.couponId || null,
                    items: {
                        create: data.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            size: item.size,
                            color: item.color
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

            createdOrder = order;

            if (data.couponId) {
                await tx.coupon.update({
                    where: { id: data.couponId },
                    data: { usedCount: { increment: 1 } }
                });
            }
        });

        revalidatePath('/admin/orders');

        // Return order data for WhatsApp link generation (done on client side)
        return {
            success: true,
            orderId: createdOrder.id,
            orderNumber: createdOrder.orderNumber
        };

    } catch (error) {
        console.error('Failed to create order:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

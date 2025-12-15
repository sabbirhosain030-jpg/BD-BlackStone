'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type CouponInput = {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    amount: number;
    usageLimit?: number;
    expiresAt?: string; // Date string from form
};

export async function createCoupon(data: CouponInput) {
    try {
        const existing = await prisma.coupon.findUnique({
            where: { code: data.code.toUpperCase() }
        });

        if (existing) {
            return { success: false, error: 'Coupon code already exists' };
        }

        await prisma.coupon.create({
            data: {
                code: data.code.toUpperCase(),
                discountType: data.discountType,
                amount: data.amount,
                usageLimit: data.usageLimit || null,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                isActive: true
            }
        });

        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        console.error('Create coupon error:', error);
        return { success: false, error: 'Failed to create coupon' };
    }
}

export async function deleteCoupon(id: string) {
    try {
        await prisma.coupon.delete({ where: { id } });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete coupon' };
    }
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.coupon.update({
            where: { id },
            data: { isActive: !currentStatus }
        });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function getAllCoupons() {
    try {
        return await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}

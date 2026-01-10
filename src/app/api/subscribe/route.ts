import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate unique coupon code
function generateCouponCode(prefix: string): string {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomPart}`;
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Check if email already subscribed
        const existing = await prisma.emailSubscriber.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Email already subscribed', couponCode: existing.couponCode },
                { status: 200 }
            );
        }

        // Get popup settings for coupon generation
        const settings = await prisma.popupSettings.findFirst();
        const couponPrefix = settings?.couponPrefix || 'WELCOME';
        const discountPercent = settings?.discountPercent || 12;

        // Generate unique coupon code
        let couponCode = generateCouponCode(couponPrefix);
        let attempts = 0;
        while (attempts < 5) {
            const existingCoupon = await prisma.coupon.findUnique({
                where: { code: couponCode }
            });
            if (!existingCoupon) break;
            couponCode = generateCouponCode(couponPrefix);
            attempts++;
        }

        // Create coupon
        await prisma.coupon.create({
            data: {
                code: couponCode,
                discountType: 'PERCENTAGE',
                amount: discountPercent,
                isActive: true,
                usageLimit: 1 // One-time use per subscriber
            }
        });

        // Save subscriber
        await prisma.emailSubscriber.create({
            data: {
                email,
                couponCode
            }
        });

        return NextResponse.json({
            success: true,
            couponCode,
            message: 'Subscribed successfully!'
        });

    } catch (error) {
        console.error('Subscribe API error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe. Please try again.' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.popupSettings.findFirst();

        // If no settings exist, create default
        if (!settings) {
            settings = await prisma.popupSettings.create({
                data: {
                    isEnabled: true,
                    title: 'GET 12% OFF YOUR FIRST ORDER',
                    subtitle: 'And be the first to hear about our new product drops!',
                    discountPercent: 12,
                    couponPrefix: 'WELCOME',
                    buttonText: 'GET 12% OFF'
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Popup settings API error:', error);
        return NextResponse.json(
            { error: 'Failed to load settings' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
    try {
        let settings = await prisma.popupSettings.findFirst();

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
        console.error('Admin popup settings GET error:', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        let settings = await prisma.popupSettings.findFirst();

        if (settings) {
            settings = await prisma.popupSettings.update({
                where: { id: settings.id },
                data: {
                    isEnabled: data.isEnabled,
                    title: data.title,
                    subtitle: data.subtitle,
                    discountPercent: data.discountPercent,
                    couponPrefix: data.couponPrefix,
                    buttonText: data.buttonText
                }
            });
        } else {
            settings = await prisma.popupSettings.create({ data });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Admin popup settings POST error:', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

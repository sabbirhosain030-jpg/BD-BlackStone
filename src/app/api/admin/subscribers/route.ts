import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const subscribers = await prisma.emailSubscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Admin subscribers GET error:', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

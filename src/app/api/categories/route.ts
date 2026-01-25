import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                description: true
            }
        });

        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

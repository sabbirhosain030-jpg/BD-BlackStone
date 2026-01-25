import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                subCategories: {
                    orderBy: { name: 'asc' }
                }
            }
        });

        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

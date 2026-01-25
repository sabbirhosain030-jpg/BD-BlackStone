import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const subcategories = await prisma.subCategory.findMany({
            include: {
                category: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(subcategories);
    } catch (error) {
        console.error('Subcategories GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, categoryId } = body;
        let { slug } = body;

        // Auto-generate slug if not provided
        if (!slug) {
            slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const subcategory = await prisma.subCategory.create({
            data: { name, slug, categoryId }
        });

        return NextResponse.json(subcategory);
    } catch (error: any) {
        console.error('Subcategories POST error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create' },
            { status: 500 }
        );
    }
}

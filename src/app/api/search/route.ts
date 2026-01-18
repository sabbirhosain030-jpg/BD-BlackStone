import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        if (query.length < 2) {
            return NextResponse.json({ products: [] });
        }

        // Fuzzy search on product name and category
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { name: { contains: query, mode: 'insensitive' } } }
                ]
            },
            include: {
                category: true
            },
            take: 8,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const results = products.map(p => {
            let image = '/placeholder.png';
            try {
                const images = JSON.parse(p.images);
                if (Array.isArray(images) && images.length > 0) image = images[0];
            } catch (e) { }

            return {
                id: p.id,
                name: p.name,
                category: p.category.name,
                price: p.price,
                image
            };
        });

        return NextResponse.json({ products: results });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ products: [] }, { status: 500 });
    }
}

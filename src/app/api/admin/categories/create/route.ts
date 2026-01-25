import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        let slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const brand = formData.get('brand') as string || 'BLACK STONE';
        const subcategoriesJson = formData.get('subcategories') as string;

        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        // Auto-generate slug if not provided
        if (!slug) {
            slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        // Parse subcategories
        let subcategories: string[] = [];
        if (subcategoriesJson) {
            try {
                subcategories = JSON.parse(subcategoriesJson);
            } catch (e) {
                console.error('Failed to parse subcategories:', e);
            }
        }

        // Create category with subcategories in a transaction
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description: description || undefined,
                brand,
                subCategories: {
                    create: subcategories.map(subName => ({
                        name: subName,
                        slug: subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    }))
                }
            },
            include: {
                subCategories: true
            }
        });

        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        console.error('Failed to create category:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create category' },
            { status: 500 }
        );
    }
}

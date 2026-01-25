import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single category
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                subCategories: {
                    orderBy: { name: 'asc' }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Failed to fetch category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// UPDATE category
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { name, slug, description, brand } = body;

        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                description: description || null,
                brand: brand || 'BLACK STONE'
            }
        });

        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        console.error('Failed to update category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE category
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Prisma will cascade delete subcategories automatically
        await prisma.category.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete category:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

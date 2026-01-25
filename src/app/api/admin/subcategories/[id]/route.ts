import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single subcategory
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const subCategory = await prisma.subCategory.findUnique({
            where: { id: params.id },
            include: {
                category: true
            }
        });

        if (!subCategory) {
            return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
        }

        return NextResponse.json(subCategory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch subcategory' }, { status: 500 });
    }
}

// PUT update subcategory
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const { name, slug, categoryId } = await request.json();

        const subCategory = await prisma.subCategory.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                categoryId
            }
        });

        return NextResponse.json(subCategory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 });
    }
}

// DELETE subcategory
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.subCategory.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
    }
}

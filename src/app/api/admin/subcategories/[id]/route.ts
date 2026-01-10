import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { name, slug, categoryId } = await request.json();

        const subcategory = await prisma.subCategory.update({
            where: { id },
            data: { name, slug, categoryId }
        });

        return NextResponse.json(subcategory);
    } catch (error: any) {
        console.error('Subcategory PUT error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.subCategory.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Subcategory DELETE error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ productIds: [] });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                wishlists: {
                    select: { productId: true }
                }
            }
        });

        const productIds = user?.wishlists.map(w => w.productId) || [];

        return NextResponse.json({ productIds });
    } catch (error) {
        console.error('Wishlist GET error:', error);
        return NextResponse.json({ productIds: [] }, { status: 500 });
    }
}

// POST - Add to wishlist
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create wishlist entry (unique constraint prevents duplicates)
        await prisma.wishlist.create({
            data: {
                userId: user.id,
                productId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        // Handle duplicate entry gracefully
        if (error.code === 'P2002') {
            return NextResponse.json({ success: true }); // Already in wishlist
        }
        console.error('Wishlist POST error:', error);
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

// DELETE - Remove from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.wishlist.deleteMany({
            where: {
                userId: user.id,
                productId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Wishlist DELETE error:', error);
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}

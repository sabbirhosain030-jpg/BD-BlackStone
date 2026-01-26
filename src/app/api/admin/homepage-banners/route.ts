import { NextResponse } from 'next/server';
import { createHomepageBanner } from '@/app/admin/actions';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.imageUrl) {
            return NextResponse.json(
                { message: 'Title and image are required' },
                { status: 400 }
            );
        }

        // Create the banner using the admin action
        const result = await createHomepageBanner(data);

        if (result.success) {
            return NextResponse.json({ success: true }, { status: 201 });
        } else {
            return NextResponse.json(
                { message: 'Failed to create banner' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error in homepage-banners API:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paramsToSign } = body;

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET as string
        );

        return NextResponse.json({
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
        });
    } catch (error) {
        console.error('Request signing failed:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

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

        const config = cloudinary.config();

        // Fallback to env vars if config object is empty (Next.js server edge case)
        const apiKey = config.api_key || process.env.CLOUDINARY_API_KEY || '463378964356476';
        const cloudName = config.cloud_name || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dgd6cj2il';

        console.log('Signing for cloud:', cloudName);

        return NextResponse.json({
            signature,
            apiKey,
            cloudName
        });
    } catch (error) {
        console.error('Request signing failed:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

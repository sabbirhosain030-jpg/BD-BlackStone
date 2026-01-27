import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { paramsToSign } = body;

        // Manual Signature Generation (transparent debugging)
        // 1. Sort keys
        const sortedKeys = Object.keys(paramsToSign).sort();

        // 2. Create string to sign: key=value&key=value
        const stringToSign = sortedKeys.map(key => `${key}=${paramsToSign[key]}`).join('&');

        // 3. Append secret
        const apiSecret = process.env.CLOUDINARY_API_SECRET || 'D8rII7YZyRJKs87p73JBGHAfcaI';
        const stringToSignWithSecret = stringToSign + apiSecret;

        // 4. SHA1 Hash
        const signature = crypto.createHash('sha1').update(stringToSignWithSecret).digest('hex');

        console.log('--- MANUAL SIGNATURE DEBUG ---');
        console.log('String to Sign:', stringToSign);
        console.log('Secret (last 4):', apiSecret.slice(-4));
        console.log('Generated Signature:', signature);
        console.log('------------------------------');

        const config = cloudinary.config();

        // Fallback to env vars if config object is empty (Next.js server edge case)
        const apiKey = config.api_key || process.env.CLOUDINARY_API_KEY || '821597842927314';
        const cloudName = config.cloud_name || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'deruyslfy';

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

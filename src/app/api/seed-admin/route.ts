import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@blackstone.com' },
            update: {
                password: hashedPassword,
                role: 'ADMIN' // Ensure role is ADMIN
            },
            create: {
                email: 'admin@blackstone.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
            },
        });

        return NextResponse.json({
            success: true,
            message: '✅ Admin user restored successfully.',
            credentials: {
                email: 'admin@blackstone.com',
                password: 'admin123'
            }
        });
    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to seed admin user.'
        }, { status: 500 });
    }
}

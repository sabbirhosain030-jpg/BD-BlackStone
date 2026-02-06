import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log('🔄 Starting admin authentication reset...');

        // Step 1: Delete ALL existing admin users to ensure clean state
        const deletedCount = await prisma.user.deleteMany({
            where: {
                role: 'ADMIN'
            }
        });
        console.log(`🗑️  Deleted ${deletedCount.count} existing admin user(s)`);

        // Step 2: Create fresh admin with strong secure password
        // Using bcrypt with 12 rounds for enhanced security
        const strongPassword = 'Admin@2026!';
        const hashedPassword = await bcrypt.hash(strongPassword, 12);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@blackstone.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN',
            },
        });

        console.log('✅ Fresh admin user created successfully');

        return NextResponse.json({
            success: true,
            message: '✅ Admin authentication reset successfully. All old credentials deleted.',
            credentials: {
                email: 'admin@blackstone.com',
                password: strongPassword,
                note: 'Password is securely hashed with bcrypt (12 rounds)'
            },
            adminId: admin.id
        });
    } catch (error) {
        console.error('❌ Seed Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to reset admin user.',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

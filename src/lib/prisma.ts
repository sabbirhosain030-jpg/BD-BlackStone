import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Validate DATABASE_URL is present (server-side only warning — do NOT throw here as it crashes client bundles)
if (typeof window === 'undefined' && !process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('Please add DATABASE_URL (MongoDB URI) to your .env file or Vercel environment variables.');
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

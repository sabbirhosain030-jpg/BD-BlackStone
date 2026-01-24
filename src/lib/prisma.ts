import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Validate DATABASE_URL is present
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('Please add DATABASE_URL to your .env file or Vercel environment variables.');
    throw new Error('DATABASE_URL is required but not found in environment variables');
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });

// Log database connection info (only in development or first connection)
if (process.env.NODE_ENV === 'development') {
    console.log('✅ Database connection configured');
    console.log('   URL:', process.env.DATABASE_URL.substring(0, 20) + '...');
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

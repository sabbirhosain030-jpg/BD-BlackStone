import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

if (process.env.DATABASE_URL) {
    console.log('DEBUG: DATABASE_URL loaded:', process.env.DATABASE_URL.substring(0, 15) + '...');
    console.log('DEBUG: DATABASE_URL length:', process.env.DATABASE_URL.length);
} else {
    console.log('DEBUG: DATABASE_URL is undefined');
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

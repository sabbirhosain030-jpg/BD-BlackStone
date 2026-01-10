const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const url = process.env.DATABASE_URL;
    if (url) {
        console.log('DEBUG (test-db): DATABASE_URL loaded:', url.substring(0, 15) + '...');
        console.log('DEBUG (test-db): DATABASE_URL length:', url.length);
    } else {
        console.log('DEBUG (test-db): DATABASE_URL is undefined');
    }

    try {
        await prisma.$connect();
        console.log('Successfully connected to the database!');
    } catch (error) {
        console.error('Connection failed:', error.message);
        // console.error('Full Error:', JSON.stringify(error, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}

main();

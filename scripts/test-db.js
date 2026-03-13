const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Testing DB connection...');
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: 'admin@blackstone.com' },
                    { phone: '01712345678' }
                ]
            }
        });
        console.log('User found:', user ? user.email : 'None');
        console.log('Phone field value:', user ? user.phone : 'N/A');
    } catch (e) {
        console.error('DB Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

test();

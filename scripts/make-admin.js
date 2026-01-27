// Script to make a user an admin
// Usage: node scripts/make-admin.js <email>

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin() {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Please provide an email address');
        console.log('Usage: node scripts/make-admin.js <email>');
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        });

        console.log('✅ Successfully made user an admin:');
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log('\n🎉 You can now login to /admin with this account!');
    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.code === 'P2025') {
            console.log(`\n💡 User with email "${email}" not found.`);
            console.log('   Please sign up first at http://localhost:3000/signup');
        }
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();

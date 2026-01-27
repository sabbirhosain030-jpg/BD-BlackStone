// Debug admin login issue
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugAdminLogin() {
    try {
        console.log('🔍 Checking database for admin user...\n');

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: 'admin@blackstone.com' }
        });

        if (!user) {
            console.log('❌ User not found in database!');
            return;
        }

        console.log('✅ User found:');
        console.log('   ID:', user.id);
        console.log('   Name:', user.name);
        console.log('   Email:', user.email);
        console.log('   Role:', user.role);
        console.log('   Has Password:', !!user.password);
        console.log('   Password Hash Length:', user.password?.length);
        console.log('');

        // Test password
        const testPassword = 'Admin123!';
        console.log('🔐 Testing password:', testPassword);

        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log('   Result:', isValid ? '✅ VALID' : '❌ INVALID');
        console.log('');

        // Check all users
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        console.log('📊 All users in database:');
        allUsers.forEach((u, i) => {
            console.log(`   ${i + 1}. ${u.email} (${u.role})`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

debugAdminLogin();

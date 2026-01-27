// Verify and fix admin user
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixAdminUser() {
    try {
        // Delete existing user if any
        await prisma.user.deleteMany({
            where: { email: 'admin@blackstone.com' }
        });

        console.log('🔧 Creating fresh admin user...\n');

        // Create password hash with same salt rounds as auth.ts (12)
        const hashedPassword = await bcrypt.hash('Admin123!', 12);

        // Create new admin user
        const admin = await prisma.user.create({
            data: {
                email: 'admin@blackstone.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    admin@blackstone.com');
        console.log('🔑 Password: Admin123!');
        console.log('👤 Role:     ADMIN');
        console.log('🆔 ID:       ' + admin.id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🎉 Try logging in now at /admin/login\n');

        // Test password verification
        const isValid = await bcrypt.compare('Admin123!', admin.password);
        console.log('✅ Password verification test:', isValid ? 'PASSED' : 'FAILED');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixAdminUser();

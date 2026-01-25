import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Deleting old Men\'s Fashion and Women\'s Fashion categories...\n');

    // Delete Men's Fashion (slug: mens-fashion)
    const deletedMens = await prisma.category.deleteMany({
        where: { slug: 'mens-fashion' }
    });

    console.log(`✅ Deleted ${deletedMens.count} Men's Fashion category`);

    // Delete Women's Fashion (slug: womens-fashion)
    const deletedWomens = await prisma.category.deleteMany({
        where: { slug: 'womens-fashion' }
    });

    console.log(`✅ Deleted ${deletedWomens.count} Women's Fashion category`);

    // Also delete Accessories if you don't need it
    const deletedAccessories = await prisma.category.deleteMany({
        where: { slug: 'accessories' }
    });

    console.log(`✅ Deleted ${deletedAccessories.count} Accessories category`);

    console.log('\n✅ Done! Remaining categories should be:');
    console.log('  - Men (slug: men)');
    console.log('  - Women (slug: women)');
    console.log('  - Boys (slug: boys)');
    console.log('  - Girls (slug: girls)');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

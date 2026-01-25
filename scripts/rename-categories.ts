import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking and renaming categories...\n');

    // First, check what exists
    const allCategories = await prisma.category.findMany({
        select: { id: true, name: true, slug: true }
    });

    console.log('Current categories:');
    allCategories.forEach(cat => {
        console.log(`  - ${cat.name} (slug: ${cat.slug})`);
    });
    console.log('');

    // Update Men category by slug
    const menUpdate = await prisma.category.updateMany({
        where: {
            slug: 'men',
            NOT: { name: "Men's Fashion" }
        },
        data: {
            name: "Men's Fashion"
        }
    });

    if (menUpdate.count > 0) {
        console.log('✅ Updated Men → Men\'s Fashion');
    } else {
        console.log('ℹ️  Men already named "Men\'s Fashion" or not found');
    }

    // Update Women category by slug  
    const womenUpdate = await prisma.category.updateMany({
        where: {
            slug: 'women',
            NOT: { name: "Women's Fashion" }
        },
        data: {
            name: "Women's Fashion"
        }
    });

    if (womenUpdate.count > 0) {
        console.log('✅ Updated Women → Women\'s Fashion');
    } else {
        console.log('ℹ️  Women already named "Women\'s Fashion" or not found');
    }

    console.log('\n✅ Done!');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

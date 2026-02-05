import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DUPLICATE_CATEGORIES = [
    { id: 'ab9d5f92-f01a-4780-acca-1de7e363f356', name: "Men's Fashion", replacementSlug: 'men' },
    { id: '63629ee4-1800-41a1-83aa-3cd75815d011', name: "Women's Fashion", replacementSlug: 'women' }
];

async function cleanupDatabase(verifyOnly = false) {
    console.log(verifyOnly ? '🔍 VERIFICATION MODE - No changes will be made\n' : '🧹 CLEANUP MODE - Making changes\n');

    try {
        // Step 1: Check current categories
        console.log('📊 Current Categories:');
        const categories = await prisma.category.findMany({
            select: { id: true, name: true, slug: true, brand: true, _count: { select: { products: true } } }
        });
        categories.forEach(cat => {
            console.log(`  - ${cat.name} (${cat.slug}) [${cat.brand}] - ${cat._count.products} products`);
        });
        console.log('');

        if (verifyOnly) {
            console.log('✅ Verification complete. Run without --verify flag to make changes.');
            return;
        }

        // Step 2: Migrate products from duplicate categories
        for (const dupCat of DUPLICATE_CATEGORIES) {
            const category = await prisma.category.findUnique({
                where: { id: dupCat.id },
                include: { products: true }
            });

            if (!category) {
                console.log(`⚠️  Category "${dupCat.name}" not found, skipping...`);
                continue;
            }

            if (category.products.length > 0) {
                console.log(`📦 Migrating ${category.products.length} products from "${dupCat.name}" to "${dupCat.replacementSlug}"...`);

                const targetCategory = await prisma.category.findUnique({
                    where: { slug: dupCat.replacementSlug }
                });

                if (!targetCategory) {
                    console.error(`❌ Target category "${dupCat.replacementSlug}" not found!`);
                    continue;
                }

                // Update all products to use the correct category
                await prisma.product.updateMany({
                    where: { categoryId: dupCat.id },
                    data: { categoryId: targetCategory.id }
                });

                console.log(`   ✅ Migrated ${category.products.length} products successfully`);
            }

            // Step 3: Delete duplicate category
            console.log(`🗑️  Deleting duplicate category: "${dupCat.name}"...`);
            await prisma.category.delete({
                where: { id: dupCat.id }
            });
            console.log(`   ✅ Deleted successfully\n`);
        }

        // Step 4: Verify final state
        console.log('📊 Final Categories:');
        const finalCategories = await prisma.category.findMany({
            select: { id: true, name: true, slug: true, brand: true, _count: { select: { products: true } } },
            orderBy: { name: 'asc' }
        });
        finalCategories.forEach(cat => {
            console.log(`  - ${cat.name} (${cat.slug}) [${cat.brand}] - ${cat._count.products} products`);
        });

        console.log('\n✅ Database cleanup completed successfully!');
        console.log(`   Final category count: ${finalCategories.length}`);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Check command line arguments
const verifyMode = process.argv.includes('--verify');
cleanupDatabase(verifyMode)
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });

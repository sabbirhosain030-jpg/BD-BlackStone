
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Deleting Footwear Category ---');

    try {
        const footwear = await prisma.category.findFirst({
            where: {
                OR: [
                    { slug: 'footwear' },
                    { name: 'Footwear' }
                ]
            }
        });

        if (!footwear) {
            console.log('Category "Footwear" not found. Skipping.');
            return;
        }

        console.log(`Found category: ${footwear.name} (${footwear.id})`);

        // Products will be cascaded or handled by relation logic, 
        // strictly removing the category usually requires clearing products first if no cascade.
        // Schema has `onDelete: Cascade` for Products -> Category, so this should work.

        await prisma.category.delete({
            where: { id: footwear.id }
        });

        console.log('Successfully deleted "Footwear" category and associated products.');

    } catch (error) {
        console.error('Error deleting category:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

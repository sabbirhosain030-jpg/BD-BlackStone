import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating Boys and Girls categories...');

    // Create Boys category with subcategories
    const boys = await prisma.category.upsert({
        where: { slug: 'boys' },
        update: {
            brand: 'BLACK STONE',
            description: 'Stylish clothing for boys'
        },
        create: {
            name: 'Boys',
            slug: 'boys',
            brand: 'BLACK STONE',
            description: 'Stylish clothing for boys',
            subCategories: {
                create: [
                    { name: 'Panjabi', slug: 'boys-panjabi' },
                    { name: 'Shirt', slug: 'boys-shirt' },
                    { name: 'T-Shirt', slug: 'boys-tshirt' },
                    { name: 'Pant', slug: 'boys-pant' },
                ]
            }
        },
        include: {
            subCategories: true
        }
    });

    console.log('✅ Boys category created:', boys);

    // Create Girls category with subcategories
    const girls = await prisma.category.upsert({
        where: { slug: 'girls' },
        update: {
            brand: 'GAZZELLE',
            description: 'Beautiful styles for young girls'
        },
        create: {
            name: 'Girls',
            slug: 'girls',
            brand: 'GAZZELLE',
            description: 'Beautiful styles for young girls',
            subCategories: {
                create: [
                    { name: 'Frock', slug: 'girls-frock' },
                    { name: 'Kurti', slug: 'girls-kurti' },
                    { name: 'Three Piece', slug: 'girls-three-piece' },
                    { name: 'Lehenga', slug: 'girls-lehenga' },
                ]
            }
        },
        include: {
            subCategories: true
        }
    });

    console.log('✅ Girls category created:', girls);

    console.log('\n🎉 Done! Boys and Girls categories created successfully.');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

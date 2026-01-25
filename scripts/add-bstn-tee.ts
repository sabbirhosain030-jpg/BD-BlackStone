import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Adding BSTN Signature Box-Cut Mesh Tee to inventory...\n');

    // Find Men category and T-Shirt subcategory
    const menCategory = await prisma.category.findFirst({
        where: { slug: 'men' },
        include: {
            subCategories: {
                where: {
                    OR: [
                        { slug: 'men-tshirt' },
                        { slug: 'men-t-shirt' },
                        { name: { contains: 'T-Shirt', mode: 'insensitive' } }
                    ]
                }
            }
        }
    });

    if (!menCategory) {
        throw new Error('Men category not found!');
    }

    const tshirtSubCategory = menCategory.subCategories[0];
    if (!tshirtSubCategory) {
        throw new Error('T-Shirt subcategory not found! Please create it first.');
    }

    console.log(`Found category: ${menCategory.name}`);
    console.log(`Found subcategory: ${tshirtSubCategory.name}\n`);

    // Create the product with all 4 colors
    const product = await prisma.product.create({
        data: {
            name: 'BSTN Signature Box-Cut Mesh Tee',
            description: 'The ultimate fusion of Middle Eastern street style and modern functionality. Designed in the UAE & Egypt, this signature box-cut tee features technical mesh side panels for maximum breathability and a bold, structured silhouette.\n\nFabric: Premium Heavyweight Terry Cotton (Luxury feel with high shape retention).\nSide Panels: Breathable High-Performance Mesh (Engineered for airflow and a technical look).',
            price: 2499,
            images: JSON.stringify([
                '/images/products/bstn-tee-black-1.jpg',
                '/images/products/bstn-tee-black-2.jpg',
                '/images/products/bstn-tee-white-1.jpg',
                '/images/products/bstn-tee-white-2.jpg',
                '/images/products/bstn-tee-gray-1.jpg',
                '/images/products/bstn-tee-gray-2.jpg',
                '/images/products/bstn-tee-beige-1.jpg',
                '/images/products/bstn-tee-beige-2.jpg'
            ]),
            colors: JSON.stringify(['Black', 'White', 'Dark Gray', 'Beige']),
            sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
            stock: 100,
            isNew: true,
            isFeatured: true,
            categoryId: menCategory.id,
            subCategoryId: tshirtSubCategory.id
        }
    });

    console.log('✅ Product created successfully!');
    console.log('\nProduct Details:');
    console.log(`  ID: ${product.id}`);
    console.log(`  Name: ${product.name}`);
    console.log(`  Price: ${product.price} BDT`);
    console.log(`  Colors: ${JSON.parse(product.colors || '[]').join(', ')}`);
    console.log(`  Category: ${menCategory.name} → ${tshirtSubCategory.name}`);
    console.log(`  Images: ${JSON.parse(product.images || '[]').length} images`);
    console.log('\n🎉 Product ready to sell!');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

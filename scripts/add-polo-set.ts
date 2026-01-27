
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Adding new Polo Set product...');

    // 1. Find the Category (Men's Fashion) and Sub-Category (Polo T-Shirt)
    const category = await prisma.category.findFirst({
        where: { slug: 'men' }, // assuming 'men' is the slug for Men's Fashion
        include: { subCategories: true }
    });

    if (!category) {
        console.error('Men category not found!');
        return;
    }

    const subCategory = await prisma.subCategory.findFirst({
        where: {
            categoryId: category.id,
            slug: 'polo-t-shirts' // I need to verify this slug, assuming standard
        }
    });

    // If slug is different, let's try to find by name just in case
    const targetSubCategory = subCategory || category.subCategories.find((s: any) => s.name.includes('Polo'));

    if (!targetSubCategory) {
        console.error('Polo T-Shirt subcategory not found! Available:', category.subCategories.map((s: any) => s.name));
        return;
    }

    console.log(`Found SubCategory: ${targetSubCategory.name} (${targetSubCategory.id})`);

    // 2. Check for existing and delete
    const existing = await prisma.product.findFirst({
        where: { name: "The Signature Pique Quarter-Zip & Shorts Set" }
    });

    if (existing) {
        console.log(`Deleting existing product with same name (${existing.id})...`);
        await prisma.product.delete({ where: { id: existing.id } });
    }

    // 3. Create the Product
    const product = await prisma.product.create({
        data: {
            name: "The Signature Pique Quarter-Zip & Shorts Set",
            description: `Elevate Your Everyday Essentials. Experience the perfect blend of athletic functionality and sophisticated style. This premium two-piece set is engineered for the modern man who demands both comfort and a sharp silhouette.

**Fabric:** Premium Pique Knit: Crafted from a high-density Pique fabric that offers a breathable, textured feel and superior durability. It maintains its shape wash after wash.`,
            price: 2799,
            previousPrice: 3500, // Assuming a discount to show value
            stock: 50,
            images: JSON.stringify([
                '/products/premium-set/1.jpg',
                '/products/premium-set/2.jpg',
                '/products/premium-set/3.jpg',
                '/products/premium-set/4.jpg',
                '/products/premium-set/5.jpg'
            ]),
            categoryId: category.id,
            subCategoryId: targetSubCategory.id,
            isNew: true,
            isFeatured: true,
            colors: JSON.stringify(['#1a1a1a', '#ffffff', '#808080']),
            sizes: JSON.stringify(['M', 'L', 'XL', 'XXL'])
        }
    });

    console.log(`✅ Successfully added product: ${product.name}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

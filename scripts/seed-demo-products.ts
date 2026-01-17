/**
 * Seed Demo Products for Client Presentation
 * Run: npx ts-node scripts/seed-demo-products.ts
 * 
 * NOTE: All products are marked as [DEMO] for easy identification
 * Delete from /admin/products when ready for production
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding demo products for client presentation...\n');

    // Get categories (create if they don't exist)
    let mensCategory = await prisma.category.findFirst({ where: { slug: 'mens-fashion' } });
    let womensCategory = await prisma.category.findFirst({ where: { slug: 'womens-fashion' } });

    if (!mensCategory) {
        mensCategory = await prisma.category.create({
            data: {
                name: "Men's Fashion",
                slug: 'mens-fashion',
                description: 'Premium clothing for men'
            }
        });
    }

    if (!womensCategory) {
        womensCategory = await prisma.category.create({
            data: {
                name: "Women's Fashion",
                slug: 'womens-fashion',
                description: 'Elegant clothing for women'
            }
        });
    }

    // Demo Products
    const demoProducts = [
        // Men's Products
        {
            name: '[DEMO] Premium Navy Blazer',
            description: 'Elegant navy blue blazer perfect for formal occasions. Made from premium fabric with a modern slim fit.',
            price: 5500,
            previousPrice: 7000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-navy-blazer',
            sizes: 'S, M, L, XL, XXL',
            colors: 'Navy Blue, Charcoal Gray',
            stock: 25,
            isNew: true,
            isFeatured: true,
            categoryId: mensCategory.id
        },
        {
            name: '[DEMO] Classic White Formal Shirt',
            description: 'Crisp white formal shirt with premium cotton fabric. Perfect for office and formal events.',
            price: 1800,
            previousPrice: 2500,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-white-shirt',
            sizes: 'S, M, L, XL',
            colors: 'White, Light Blue',
            stock: 40,
            isNew: false,
            isFeatured: true,
            categoryId: mensCategory.id
        },
        {
            name: '[DEMO] Slim Fit Black Trousers',
            description: 'Modern slim fit trousers in classic black. Comfortable and stylish for any occasion.',
            price: 2200,
            previousPrice: null,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-black-trousers',
            sizes: '30, 32, 34, 36, 38',
            colors: 'Black, Navy, Gray',
            stock: 30,
            isNew: false,
            isFeatured: false,
            categoryId: mensCategory.id
        },
        {
            name: '[DEMO] Designer Leather Belt',
            description: 'Premium genuine leather belt with elegant buckle. Completes any formal look.',
            price: 1500,
            previousPrice: 2000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1624222247344-550fb60583b2?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-leather-belt',
            sizes: 'M, L, XL',
            colors: 'Black, Brown, Tan',
            stock: 20,
            isNew: true,
            isFeatured: false,
            categoryId: mensCategory.id
        },
        {
            name: '[DEMO] Casual Denim Jacket',
            description: 'Classic denim jacket with modern fit. Perfect for casual and smart-casual looks.',
            price: 3800,
            previousPrice: 4500,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-denim-jacket',
            sizes: 'M, L, XL',
            colors: 'Blue Denim, Black Denim',
            stock: 15,
            isNew: false,
            isFeatured: true,
            categoryId: mensCategory.id
        },

        // Women's Products
        {
            name: '[DEMO] Elegant Floral Dress',
            description: 'Beautiful floral pattern dress perfect for any occasion. Comfortable and stylish.',
            price: 3200,
            previousPrice: 4000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-floral-dress',
            sizes: 'S, M, L, XL',
            colors: 'Pink Floral, Blue Floral',
            stock: 18,
            isNew: true,
            isFeatured: true,
            categoryId: womensCategory.id
        },
        {
            name: '[DEMO] Professional Blazer',
            description: 'Sophisticated blazer for professional women. Tailored fit with premium fabric.',
            price: 4500,
            previousPrice: 6000,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-women-blazer',
            sizes: 'S, M, L',
            colors: 'Black, Navy, Burgundy',
            stock: 12,
            isNew: true,
            isFeatured: true,
            categoryId: womensCategory.id
        },
        {
            name: '[DEMO] Casual Summer Top',
            description: 'Light and breezy summer top. Perfect for casual outings and warm weather.',
            price: 1200,
            previousPrice: null,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=1000&fit=crop',
            ]),
            imagePublicId: 'demo-summer-top',
            sizes: 'S, M, L, XL',
            colors: 'White, Beige, Pink',
            stock: 35,
            isNew: false,
            isFeatured: false,
            categoryId: womensCategory.id
        },
    ];

    console.log('📦 Creating demo products...\n');

    for (const product of demoProducts) {
        const created = await prisma.product.create({
            data: product
        });
        console.log(`✅ Created: ${created.name} - ৳${created.price}`);
    }

    console.log('\n✨ Demo products seeded successfully!');
    console.log('📊 Total products added:', demoProducts.length);
    console.log('\n💡 Note: All products are marked with [DEMO] prefix');
    console.log('🗑️  Delete from /admin/products when ready for production\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding demo products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

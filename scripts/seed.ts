
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Seeding ---');

    // 1. Create Admin User
    const adminEmail = 'admin@blackstone.com';
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log('Admin user created:', admin.email);

    // 2. Create Categories
    const categoriesData = [
        { name: "Men's Fashion", slug: 'mens-fashion', description: 'Premium clothing for men' },
        { name: "Women's Fashion", slug: 'womens-fashion', description: 'Elegant clothing and accessories for women' },
        { name: 'Accessories', slug: 'accessories', description: 'Watches, belts, and more' },
        { name: 'Footwear', slug: 'footwear', description: 'Quality shoes and boots' },
    ];

    const categories = [];
    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        categories.push(category);
        console.log('Category created:', category.name);
    }

    // 3. Create Products
    const productsData = [
        {
            name: 'Premium Black Shirt',
            description: 'A high-quality black button-down shirt, perfect for formal and semi-formal occasions.',
            price: 1200,
            previousPrice: 1500,
            stock: 50,
            isNew: true,
            isFeatured: true,
            categoryId: categories.find(c => c.slug === 'mens-fashion')?.id || '',
            images: JSON.stringify(['/images/products/mens_shirt.png']),
            sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
            colors: JSON.stringify(['Black']),
        },
        {
            name: 'Luxury Leather Handbag',
            description: 'An elegant gold-accented leather handbag that adds a touch of luxury to any outfit.',
            price: 4500,
            previousPrice: 5500,
            stock: 20,
            isNew: true,
            isFeatured: true,
            categoryId: categories.find(c => c.slug === 'womens-fashion')?.id || '',
            images: JSON.stringify(['/images/products/womens_handbag.png']),
            sizes: JSON.stringify(['One Size']),
            colors: JSON.stringify(['Tan', 'Black']),
        },
        {
            name: 'Black & Gold Watch',
            description: 'A sophisticated timepiece with a black dial and gold-tone accents, finished with a premium leather strap.',
            price: 2500,
            previousPrice: 3200,
            stock: 15,
            isNew: false,
            isFeatured: true,
            categoryId: categories.find(c => c.slug === 'accessories')?.id || '',
            images: JSON.stringify(['/images/products/watch.png']),
            sizes: JSON.stringify(['Standard']),
            colors: JSON.stringify(['Gold/Black']),
        },
        {
            name: 'Classic Leather Boots',
            description: 'Handcrafted black leather boots with a polished finish, designed for both style and durability.',
            price: 3500,
            previousPrice: 4200,
            stock: 10,
            isNew: true,
            isFeatured: false,
            categoryId: categories.find(c => c.slug === 'footwear')?.id || '',
            images: JSON.stringify(['/images/products/boots.png']),
            sizes: JSON.stringify(['40', '41', '42', '43', '44']),
            colors: JSON.stringify(['Black']),
        },
    ];

    for (const prod of productsData) {
        if (!prod.categoryId) continue;
        await prisma.product.create({
            data: prod,
        });
        console.log('Product created:', prod.name);
    }

    console.log('--- Seeding Completed ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

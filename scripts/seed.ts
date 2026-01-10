
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Seeding with Premium Data ---');

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
    console.log('Admin user created/verified:', admin.email);

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
        console.log('Category synced:', category.name);
    }

    // 3. Create Subcategories
    const subcategoriesData = [
        { name: 'Boys', slug: 'boys', categoryName: "Men's Fashion" },
        { name: 'Girls', slug: 'girls', categoryName: "Women's Fashion" },
    ];

    const subcategories = [];
    for (const subCat of subcategoriesData) {
        const parentCategory = categories.find(c => c.name === subCat.categoryName);
        if (!parentCategory) continue;

        const subcategory = await prisma.subCategory.upsert({
            where: { slug: subCat.slug },
            update: {},
            create: {
                name: subCat.name,
                slug: subCat.slug,
                categoryId: parentCategory.id
            },
        });
        subcategories.push(subcategory);
        console.log('Subcategory synced:', subcategory.name);
    }

    // 4. Create Products (Expanded Catalog)
    const productsData = [
        // Men's Fashion
        {
            name: 'Signature Black Oxford Shirt',
            description: 'A timeless staple for every wardrobe. Crafted from premium Egyptian cotton, this black Oxford shirt offers breathable comfort and a tailored fit perfect for business or casual evenings.',
            price: 2450,
            previousPrice: 3200,
            stock: 45,
            isNew: true,
            isFeatured: true,
            categoryId: categories.find(c => c.slug === 'mens-fashion')?.id!,
            images: JSON.stringify(['/images/products/mens_shirt.png']),
            sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
            colors: JSON.stringify(['Black']),
        },
        {
            name: 'Urban Slim Fit Shirt',
            description: 'Designed for the modern man. This slim-fit shirt features a sharp collar and a streamlined silhouette, making it an ideal choice for pairing with suits or chinos.',
            price: 1850,
            previousPrice: 2200,
            stock: 30,
            isNew: false,
            isFeatured: false,
            categoryId: categories.find(c => c.slug === 'mens-fashion')?.id!,
            images: JSON.stringify(['/images/products/mens_shirt.png']),
            sizes: JSON.stringify(['M', 'L', 'XL']),
            colors: JSON.stringify(['Charcoal']),
        },

        // Women's Fashion
        {
            name: 'Noir Elegance Handbag',
            description: 'Exude sophistication with our Noir Elegance Handbag. Featuring gold-tone hardware and a spacious interior, it is the perfect companion for your daily essentials.',
            price: 5500,
            previousPrice: 6800,
            stock: 15,
            isNew: true,
            isFeatured: true,
            categoryId: categories.find(c => c.slug === 'womens-fashion')?.id!,
            images: JSON.stringify(['/images/products/womens_handbag.png']),
            sizes: JSON.stringify(['One Size']),
            colors: JSON.stringify(['Black', 'Gold']),
        },
        {
            name: 'Classic Tan Tote',
            description: 'A versatile tote bag crafted from vegan leather. Its neutral tan shade compliments any outfit, while the reinforced straps ensure durability for everyday use.',
            price: 3200,
            previousPrice: 4000,
            stock: 25,
            isNew: false,
            isFeatured: false,
            categoryId: categories.find(c => c.slug === 'womens-fashion')?.id!,
            images: JSON.stringify(['/images/products/womens_handbag.png']), // Using same image as placeholder for demo
            sizes: JSON.stringify(['One Size']),
            colors: JSON.stringify(['Tan']),
        },

        // Accessories
        {
            name: 'Royal Gold & Black Series Watch',
            description: 'A statement timepiece defining luxury. The matte black dial contrasts beautifully with the gold bezel, fastened by a premium leather strap for ultimate comfort.',
            price: 4500,
            previousPrice: 5900,
            stock: 20,
            isNew: true,
            isFeatured: true,
            categoryId: categories.find(c => c.slug === 'accessories')?.id!,
            images: JSON.stringify(['/images/products/watch.png']),
            sizes: JSON.stringify(['Standard']),
            colors: JSON.stringify(['Black/Gold']),
        },
        {
            name: 'Minimalist Business Watch',
            description: 'Understated elegance. A sleek design intended for the boardroom, featuring a precise movement and a scratch-resistant glass face.',
            price: 2800,
            previousPrice: 3500,
            stock: 40,
            isNew: false,
            isFeatured: false,
            categoryId: categories.find(c => c.slug === 'accessories')?.id!,
            images: JSON.stringify(['/images/products/watch.png']),
            sizes: JSON.stringify(['Standard']),
            colors: JSON.stringify(['Silver/Black']),
        },

        // Footwear
        {
            name: 'Heritage Leather Boots',
            description: 'Rugged yet refined. These handcrafted leather boots provide superior ankle support and feature a slip-resistant sole, ready for any urban adventure.',
            price: 6500,
            previousPrice: 7500,
            stock: 12,
            isNew: true,
            isFeatured: true,
            categoryId: categories.find(c => c.slug === 'footwear')?.id!,
            images: JSON.stringify(['/images/products/boots.png']),
            sizes: JSON.stringify(['40', '41', '42', '43', '44']),
            colors: JSON.stringify(['Black']),
        },
        {
            name: 'Chelsea City Boots',
            description: 'Sleek Chelsea boots with side elastic panels for easy wear. Perfect for pairing with jeans or formal trousers for a smart-casual look.',
            price: 5200,
            previousPrice: 6000,
            stock: 18,
            isNew: false,
            isFeatured: false,
            categoryId: categories.find(c => c.slug === 'footwear')?.id!,
            images: JSON.stringify(['/images/products/boots.png']),
            sizes: JSON.stringify(['40', '41', '42', '43', '44']),
            colors: JSON.stringify(['Dark Brown']),
        },
    ];

    for (const prod of productsData) {
        if (!prod.categoryId) {
            console.warn(`Skipping product ${prod.name}: Category not found`);
            continue;
        }
        await prisma.product.create({
            data: prod,
        });
        console.log('Product created:', prod.name);
    }

    // 4. Create Coupons
    await prisma.coupon.createMany({
        data: [
            { code: 'WELCOME10', discountType: 'PERCENTAGE', amount: 10, isActive: true, usageLimit: 100 },
            { code: 'SAVE500', discountType: 'FIXED', amount: 500, isActive: true, usageLimit: 50 },
        ]
    });
    console.log('Coupons created');

    // 5. Create Marketing Banners (Optional)
    // If you have a MarketingBanner model, seed it here
    // ...

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

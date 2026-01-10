
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
    console.log('--- Starting Reset ---');

    console.log('1. Clearing Cloudinary images...');
    try {
        // Delete all resources in the folder
        // Note: verify the folder name matches your upload logic. 
        // Based on analysis: 'bd-blackstone-products'
        const folder = 'bd-blackstone-products';

        // Fetch resources in the folder to get their public_ids
        // Cloudinary API doesn't support "delete folder content" directly simply without Premium usually, 
        // but we can delete by prefix or fetch and delete.
        // Using delete_resources_by_prefix is efficient if supported, otherwise search.

        await cloudinary.api.delete_resources_by_prefix(`${folder}/`);
        console.log(`Cleared images in folder: ${folder}`);

        // Optional: delete the folder itself if empty
        // await cloudinary.api.delete_folder(folder);
    } catch (error) {
        console.warn('Cloudinary cleanup warning (might be empty or config issue):', error);
    }

    console.log('2. Clearing Database...');
    // Delete in order of dependencies (child first, then parent)

    // Deleting OrderItems first (depend on Orders and Products)
    await prisma.orderItem.deleteMany({});
    console.log('Deleted OrderItems');

    // Orders (depend on Users, Coupons)
    await prisma.order.deleteMany({});
    console.log('Deleted Orders');

    // Products (depend on Categories, SubCategories)
    await prisma.product.deleteMany({});
    console.log('Deleted Products');

    // SubCategories
    await prisma.subCategory.deleteMany({});
    console.log('Deleted SubCategories');

    // Categories
    await prisma.category.deleteMany({});
    console.log('Deleted Categories');

    // Coupons
    await prisma.coupon.deleteMany({});
    console.log('Deleted Coupons');

    // Marketing Banners
    await prisma.marketingBanner.deleteMany({});
    console.log('Deleted MarketingBanners');

    // Users
    await prisma.user.deleteMany({});
    console.log('Deleted Users');

    console.log('--- Reset Completed ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

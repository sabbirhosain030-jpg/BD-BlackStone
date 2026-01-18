'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Dashboard Stats ---
export async function getDashboardStats() {
    try {
        const totalOrders = await prisma.order.count();
        const totalProducts = await prisma.product.count();
        const totalRevenueResult = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                status: 'DELIVERED',
            },
        });

        const activeCustomers = await prisma.order.groupBy({
            by: ['customerEmail'],
        });

        const lowStockCount = await prisma.product.count({
            where: {
                stock: {
                    lte: 5,
                },
            },
        });

        return {
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueResult._sum.total || 0,
            activeCustomers: activeCustomers.length,
            lowStockCount,
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return {
            totalOrders: 0,
            totalProducts: 0,
            totalRevenue: 0,
            activeCustomers: 0,
            lowStockCount: 0,
        };
    }
}

export async function getRecentOrders() {
    try {
        const orders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                createdAt: true,
                status: true,
                total: true,
            },
        });
        return JSON.parse(JSON.stringify(orders)); // Serialize for safe transfer
    } catch (error) {
        console.error("Failed to fetch recent orders:", error);
        return [];
    }
}

// --- Product Management ---
export async function getAdminProducts() {
    try {
        return await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: true,
                subCategory: true
            }
        });
    } catch (error) {
        console.error('Failed to fetch admin products:', error);
        return [];
    }
}

export async function getProduct(id: string) {
    try {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                subCategory: true
            }
        });
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
    }
}

export async function getAdminCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                subCategories: true
            }
        });
    } catch (error) {
        console.error('Failed to fetch admin categories:', error);
        return [];
    }
}

export async function getSubCategoriesForCategory(categoryId: string) {
    try {
        return await prisma.subCategory.findMany({
            where: { categoryId },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error('Failed to fetch subcategories:', error);
        return [];
    }
}

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const previousPrice = formData.get('previousPrice') ? parseFloat(formData.get('previousPrice') as string) : null;
    const stock = parseInt(formData.get('stock') as string);
    const categoryId = formData.get('categoryId') as string;
    const subCategoryId = formData.get('subCategoryId') as string || null;
    const imageUrl = formData.get('imageUrl') as string;
    const imagePublicId = formData.get('imagePublicId') as string || null;
    const isNew = formData.get('isNew') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';
    const sizes = formData.get('sizes') as string || '["S", "M", "L", "XL"]';
    const colors = formData.get('colors') as string || '["Black", "Navy", "Grey"]';

    // Basic validation
    if (!name || !description || isNaN(price) || isNaN(stock) || !categoryId) {
        throw new Error('Missing required fields');
    }

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                price,
                previousPrice,
                stock,
                categoryId,
                subCategoryId: subCategoryId === "" ? null : subCategoryId,
                isNew,
                isFeatured,
                images: JSON.stringify([imageUrl]),
                imagePublicId,
                sizes: sizes,
                colors: colors,
            }
        });
    } catch (error) {
        console.error("Failed to create product:", error);
        throw error;
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function updateProduct(productId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const previousPrice = formData.get('previousPrice') ? parseFloat(formData.get('previousPrice') as string) : null;
    const stock = parseInt(formData.get('stock') as string);
    const categoryId = formData.get('categoryId') as string;
    const subCategoryId = formData.get('subCategoryId') as string || null;
    const imageUrl = formData.get('imageUrl') as string;
    const imagePublicId = formData.get('imagePublicId') as string || null;
    const isNew = formData.get('isNew') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';
    const sizes = formData.get('sizes') as string;
    const colors = formData.get('colors') as string;

    if (!name || !description || isNaN(price) || isNaN(stock) || !categoryId) {
        throw new Error('Missing required fields');
    }

    try {
        await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                price,
                previousPrice,
                stock,
                categoryId,
                subCategoryId: subCategoryId === "" ? null : subCategoryId,
                isNew,
                isFeatured,
                images: imageUrl ? JSON.stringify([imageUrl]) : undefined,
                imagePublicId: imagePublicId || undefined,
                sizes: sizes || undefined,
                colors: colors || undefined,
            }
        });
    } catch (error) {
        console.error("Failed to update product:", error);
        throw error;
    }

    revalidatePath('/admin/products');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(productId: string) {
    try {
        // First, get the product to find imagePublicId
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { imagePublicId: true }
        });

        // Delete from Cloudinary if imagePublicId exists
        if (product?.imagePublicId) {
            const cloudinary = require('@/lib/cloudinary').default;
            try {
                await cloudinary.uploader.destroy(product.imagePublicId);
                console.log(`Deleted image from Cloudinary: ${product.imagePublicId}`);
            } catch (cloudinaryError) {
                console.error('Failed to delete image from Cloudinary:', cloudinaryError);
                // Continue with product deletion even if Cloudinary delete fails
            }
        }

        // Delete product from database
        await prisma.product.delete({
            where: { id: productId }
        });

        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false, error: "Failed to delete product" };
    }
}

// --- Category Management ---
export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    let slug = formData.get('slug') as string;

    if (!name) {
        throw new Error('Name is required');
    }

    if (!slug) {
        slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    try {
        await prisma.category.create({
            data: {
                name,
                slug,
                description
            }
        });
    } catch (error) {
        console.error("Failed to create category:", error);
        return;
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

// ... existing content ...
export async function deleteCategory(categoryId: string) {
    try {
        await prisma.category.delete({
            where: { id: categoryId }
        });
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { success: false, error: "Failed to delete category" };
    }
}

export async function createSubCategory(categoryId: string, formData: FormData) {
    const name = formData.get('name') as string;
    let slug = formData.get('slug') as string;

    if (!name) {
        throw new Error('Name is required');
    }

    if (!slug) {
        slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    try {
        await prisma.subCategory.create({
            data: {
                name,
                slug,
                categoryId
            }
        });
        revalidatePath(`/admin/categories/${categoryId}`); // If we make a detail page
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        console.error("Failed to create subcategory:", error);
        return { success: false, error: "Failed to create subcategory" };
    }
}

export async function deleteSubCategory(subCategoryId: string) {
    try {
        await prisma.subCategory.delete({
            where: { id: subCategoryId }
        });
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete subcategory:", error);
        return { success: false, error: "Failed to delete subcategory" };
    }
}

// --- Marketing Management ---

export async function getMarketingBanners() {
    try {
        return await prisma.marketingBanner.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error('Failed to fetch marketing banners:', error);
        return [];
    }
}

export async function createMarketingBanner(formData: FormData) {
    const title = formData.get('title') as string;
    const image = formData.get('image') as string; // URL from cloudinary
    const type = formData.get('type') as string; // POSTER | MARQUEE
    const text = formData.get('text') as string;
    const isActive = formData.get('isActive') === 'on';

    try {
        await prisma.marketingBanner.create({
            data: {
                title,
                image,
                type,
                text,
                isActive
            }
        });
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (error) {
        console.error("Failed to create banner:", error);
        return { success: false, error: "Failed to create banner" };
    }
}

export async function deleteMarketingBanner(id: string) {
    try {
        await prisma.marketingBanner.delete({
            where: { id }
        });
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete banner:", error);
        return { success: false, error: "Failed to delete banner" };
    }
}

export async function toggleMarketingBanner(id: string, isActive: boolean) {
    try {
        await prisma.marketingBanner.update({
            where: { id },
            data: { isActive }
        });
        revalidatePath('/admin/marketing');
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle banner:", error);
        return { success: false, error: "Failed to toggle banner" };
    }
}

// --- Order Management ---
export async function getAdminOrders() {
    try {
        return await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                items: true
            }
        });
    } catch (error) {
        console.error('Failed to fetch admin orders:', error);
        return [];
    }
}

export async function getOrderDetails(orderId: string) {
    try {
        return await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Failed to fetch order details:', error);
        return null;
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: 'Failed to update order status' };
    }
}

// --- Subscriber Management ---

export async function getAllSubscribers() {
    try {
        const subscribers = await prisma.emailSubscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return subscribers;
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return [];
    }
}

export async function deleteSubscriber(id: string) {
    try {
        await prisma.emailSubscriber.delete({
            where: { id }
        });
        revalidatePath('/admin/subscribers');
        return { success: true };
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        return { success: false };
    }
}

// --- CMS: Site Settings ---

export async function getSiteSettings() {
    try {
        let settings = await prisma.siteSettings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'Black Stone',
                    siteTagline: 'Premium Professional Clothing',
                    contactEmail: 'contact@bdblackstone.com',
                    contactPhone: '+880 XXX XXXX',
                    alternatePhones: [],
                    address: 'Dhaka, Bangladesh'
                }
            });
        }

        return settings;
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return null;
    }
}

export async function updateSiteSettings(data: any) {
    try {
        const existing = await prisma.siteSettings.findFirst();

        if (existing) {
            await prisma.siteSettings.update({
                where: { id: existing.id },
                data
            });
        } else {
            await prisma.siteSettings.create({ data });
        }

        revalidatePath('/');
        revalidatePath('/contact');
        revalidatePath('/admin/site-settings');
        return { success: true };
    } catch (error) {
        console.error('Error updating site settings:', error);
        return { success: false };
    }
}

// --- CMS: Homepage Banners ---

export async function getAllHomepageBanners() {
    try {
        const banners = await prisma.homepageBanner.findMany({
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        return banners;
    } catch (error) {
        console.error('Error fetching banners:', error);
        return [];
    }
}

export async function getActiveBanner() {
    try {
        const now = new Date();
        const banner = await prisma.homepageBanner.findFirst({
            where: {
                isActive: true,
                OR: [
                    { startDate: null, endDate: null },
                    { startDate: { lte: now }, endDate: null },
                    { startDate: null, endDate: { gte: now } },
                    { startDate: { lte: now }, endDate: { gte: now } }
                ]
            },
            orderBy: { priority: 'desc' }
        });
        return banner;
    } catch (error) {
        console.error('Error fetching active banner:', error);
        return null;
    }
}

export async function createHomepageBanner(data: any) {
    try {
        await prisma.homepageBanner.create({ data });
        revalidatePath('/');
        revalidatePath('/admin/homepage-banners');
        return { success: true };
    } catch (error) {
        console.error('Error creating banner:', error);
        return { success: false };
    }
}

export async function updateHomepageBanner(id: string, data: any) {
    try {
        await prisma.homepageBanner.update({
            where: { id },
            data
        });
        revalidatePath('/');
        revalidatePath('/admin/homepage-banners');
        return { success: true };
    } catch (error) {
        console.error('Error updating banner:', error);
        return { success: false };
    }
}

export async function deleteHomepageBanner(id: string) {
    try {
        await prisma.homepageBanner.delete({
            where: { id }
        });
        revalidatePath('/');
        revalidatePath('/admin/homepage-banners');
        return { success: true };
    } catch (error) {
        console.error('Error deleting banner:', error);
        return { success: false };
    }
}

// --- CMS: Promotion Banners ---

export async function getAllPromotions() {
    try {
        const promotions = await prisma.promotionBanner.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return promotions;
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return [];
    }
}

export async function getActivePromotions(position?: string) {
    try {
        const now = new Date();
        const where: any = {
            isActive: true,
            OR: [
                { startDate: null, endDate: null },
                { startDate: { lte: now }, endDate: null },
                { startDate: null, endDate: { gte: now } },
                { startDate: { lte: now }, endDate: { gte: now } }
            ]
        };

        if (position) {
            where.position = position;
        }

        const promotions = await prisma.promotionBanner.findMany({ where });
        return promotions;
    } catch (error) {
        console.error('Error fetching active promotions:', error);
        return [];
    }
}

export async function createPromotion(data: any) {
    try {
        await prisma.promotionBanner.create({ data });
        revalidatePath('/');
        revalidatePath('/admin/promotions');
        return { success: true };
    } catch (error) {
        console.error('Error creating promotion:', error);
        return { success: false };
    }
}

export async function updatePromotion(id: string, data: any) {
    try {
        await prisma.promotionBanner.update({
            where: { id },
            data
        });
        revalidatePath('/');
        revalidatePath('/admin/promotions');
        return { success: true };
    } catch (error) {
        console.error('Error updating promotion:', error);
        return { success: false };
    }
}

export async function deletePromotion(id: string) {
    try {
        await prisma.promotionBanner.delete({
            where: { id }
        });
        revalidatePath('/');
        revalidatePath('/admin/promotions');
        return { success: true };
    } catch (error) {
        console.error('Error deleting promotion:', error);
        return { success: false };
    }
}

export async function incrementPromotionView(id: string) {
    try {
        await prisma.promotionBanner.update({
            where: { id },
            data: { viewCount: { increment: 1 } }
        });
    } catch (error) {
        console.error('Error incrementing view:', error);
    }
}

export async function incrementPromotionClick(id: string) {
    try {
        await prisma.promotionBanner.update({
            where: { id },
            data: { clickCount: { increment: 1 } }
        });
    } catch (error) {
        console.error('Error incrementing click:', error);
    }
}

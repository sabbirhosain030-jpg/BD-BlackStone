'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Dashboard Stats ---
export async function getDashboardStats() {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalRevenue = await prisma.order.aggregate({
        _sum: {
            total: true,
        },
        where: {
            status: 'DELIVERED', // Only count delivered orders for revenue
        },
    });

    // Basic active customers count (unique emails in orders)
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
        totalRevenue: totalRevenue._sum.total || 0,
        activeCustomers: activeCustomers.length,
        lowStockCount,
    };
}

export async function getRecentOrders() {
    return await prisma.order.findMany({
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
}

// --- Product Management ---
export async function getAdminProducts() {
    return await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            category: true,
            subCategory: true
        }
    });
}

export async function getProduct(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            subCategory: true
        }
    });
}

export async function getAdminCategories() {
    return await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        },
        include: {
            subCategories: true
        }
    });
}

export async function getSubCategoriesForCategory(categoryId: string) {
    return await prisma.subCategory.findMany({
        where: { categoryId },
        orderBy: { name: 'asc' }
    });
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
    redirect('/admin/products');
}

export async function deleteProduct(productId: string) {
    try {
        await prisma.product.delete({
            where: { id: productId }
        });
        revalidatePath('/admin/products');
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
    return await prisma.marketingBanner.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
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
    return await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            items: true
        }
    });
}

export async function getOrderDetails(orderId: string) {
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
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

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
            category: true
        }
    });
}

export async function getAdminCategories() {
    return await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const previousPrice = formData.get('previousPrice') ? parseFloat(formData.get('previousPrice') as string) : null;
    const stock = parseInt(formData.get('stock') as string);
    const categoryId = formData.get('categoryId') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const isNew = formData.get('isNew') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';

    // Basic validation
    if (!name || !description || isNaN(price) || isNaN(stock) || !categoryId) {
        // Validation error, ideally we should return this state to the form
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
                isNew,
                isFeatured,
                images: JSON.stringify([imageUrl]), // Storing as JSON array
                // Default sizes/colors for now if not provided
                sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
                colors: JSON.stringify(['Black', 'Navy', 'Grey']),
            }
        });
    } catch (error) {
        console.error("Failed to create product:", error);
        // Check if called from form action
        return;
    }

    revalidatePath('/admin/products');
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

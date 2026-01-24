'use server';

import { prisma } from '@/lib/prisma';

export interface ChatProduct {
    id: string;
    name: string;
    price: number;
    previousPrice?: number | null;
    images: string;
    stock: number;
    categoryName: string;
}

export async function searchProducts(query: string): Promise<ChatProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: 5,
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            previousPrice: p.previousPrice,
            images: p.images,
            stock: p.stock,
            categoryName: p.category.name,
        }));
    } catch (error) {
        console.error('Failed to search products:', error);
        return [];
    }
}

export async function getProductInfo(productId: string): Promise<ChatProduct | null> {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!product) return null;

        return {
            id: product.id,
            name: product.name,
            price: product.price,
            previousPrice: product.previousPrice,
            images: product.images,
            stock: product.stock,
            categoryName: product.category.name,
        };
    } catch (error) {
        console.error('Failed to get product info:', error);
        return null;
    }
}

export async function checkStock(productName: string): Promise<{ found: boolean; product?: ChatProduct }> {
    try {
        const product = await prisma.product.findFirst({
            where: {
                name: { contains: productName, mode: 'insensitive' },
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!product) {
            return { found: false };
        }

        return {
            found: true,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                previousPrice: product.previousPrice,
                images: product.images,
                stock: product.stock,
                categoryName: product.category.name,
            },
        };
    } catch (error) {
        console.error('Failed to check stock:', error);
        return { found: false };
    }
}

export async function getChatCategories() {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return categories;
    } catch (error) {
        console.error('Failed to get categories:', error);
        return [];
    }
}

export async function getCategoryProducts(slug: string): Promise<ChatProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: {
                    slug: slug,
                },
            },
            take: 5,
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            previousPrice: p.previousPrice,
            images: p.images,
            stock: p.stock,
            categoryName: p.category.name,
        }));
    } catch (error) {
        console.error('Failed to get category products:', error);
        return [];
    }
}

export async function checkOrderStatus(orderNumber: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                orderNumber: orderNumber,
            },
            select: {
                orderNumber: true,
                status: true,
                total: true,
                createdAt: true,
                customerName: true,
            },
        });

        return order;
    } catch (error) {
        console.error('Failed to check order status:', error);
        return null;
    }
}

export async function getNewArrivalsForChat(): Promise<ChatProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                isNew: true,
            },
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            previousPrice: p.previousPrice,
            images: p.images,
            stock: p.stock,
            categoryName: p.category.name,
        }));
    } catch (error) {
        console.error('Failed to get new arrivals:', error);
        return [];
    }
}

export async function getFeaturedForChat(): Promise<ChatProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                isFeatured: true,
            },
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            previousPrice: p.previousPrice,
            images: p.images,
            stock: p.stock,
            categoryName: p.category.name,
        }));
    } catch (error) {
        console.error('Failed to get featured products:', error);
        return [];
    }
}

export async function getDiscountedProducts(): Promise<ChatProduct[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                previousPrice: {
                    not: null,
                },
            },
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            previousPrice: p.previousPrice,
            images: p.images,
            stock: p.stock,
            categoryName: p.category.name,
        }));
    } catch (error) {
        console.error('Failed to get discounted products:', error);
        return [];
    }
}

'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getFeaturedProducts() {
    const products = await prisma.product.findMany({
        where: {
            isFeatured: true,
        },
        take: 8,
        orderBy: {
            createdAt: 'desc',
        },
    });
    return products;
}

export async function getNewArrivals() {
    const products = await prisma.product.findMany({
        where: {
            isNew: true,
        },
        take: 8,
        orderBy: {
            createdAt: 'desc',
        },
    });
    return products;
}

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}

// Fetch all products with optional filters
export async function getAllProducts(
    categorySlug?: string,
    sort: string = 'newest',
    minPrice?: number,
    maxPrice?: number
) {
    const where: Prisma.ProductWhereInput = {};

    if (categorySlug) {
        where.category = {
            slug: categorySlug
        };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }; // Default newest

    if (sort === 'price-low') {
        orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
        orderBy = { price: 'desc' };
    }
    // 'popular' usually requires order count logic, skipping for now or default to newest

    return await prisma.product.findMany({
        where,
        orderBy,
        include: {
            category: true
        }
    });
}

export async function getProductById(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            category: true
        }
    });
}

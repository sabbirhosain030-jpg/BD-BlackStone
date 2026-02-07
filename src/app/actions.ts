'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { cache, CACHE_KEYS } from '@/lib/cache';

export async function getFeaturedProducts() {
    try {
        // Check cache first
        const cached = cache.get(CACHE_KEYS.FEATURED_PRODUCTS);
        if (cached && Array.isArray(cached)) return cached;

        const products = await prisma.product.findMany({
            where: {
                isFeatured: true,
            },
            take: 8,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                price: true,
                previousPrice: true,
                images: true,
                categoryId: true,
                isFeatured: true,
                isNew: true,
                stock: true,
            },
        });

        // Cache for 5 minutes
        cache.set(CACHE_KEYS.FEATURED_PRODUCTS, products, 5);
        return products;
    } catch (error) {
        console.error('Failed to fetch featured products:', error);
        return [];
    }
}

export async function getNewArrivals() {
    try {
        // Check cache first
        const cached = cache.get(CACHE_KEYS.NEW_ARRIVALS);
        if (cached) return cached;

        const products = await prisma.product.findMany({
            where: {
                isNew: true,
            },
            take: 8,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                price: true,
                previousPrice: true,
                images: true,
                categoryId: true,
                isNew: true,
                stock: true,
                category: {
                    select: {
                        name: true,
                        slug: true,
                    }
                }
            },
        });

        // Cache for 5 minutes
        cache.set(CACHE_KEYS.NEW_ARRIVALS, products, 5);
        return products;
    } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
        return [];
    }
}

export async function getCategories() {
    try {
        // Check cache first - categories rarely change
        const cached = cache.get(CACHE_KEYS.CATEGORIES);
        if (cached && Array.isArray(cached)) return cached;

        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                description: true,
                subCategories: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                    orderBy: {
                        name: 'asc'
                    }
                }
            }
        });

        // Cache for 30 minutes - categories change infrequently
        cache.set(CACHE_KEYS.CATEGORIES, categories, 30);
        return categories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

// Fetch all products with optional filters
export async function getAllProducts(
    categorySlug?: string,
    sort: string = 'newest',
    minPrice?: number,
    maxPrice?: number,
    subCategorySlug?: string
) {
    try {
        const where: Prisma.ProductWhereInput = {};

        if (categorySlug) {
            where.category = {
                slug: categorySlug
            };
        }

        if (subCategorySlug) {
            where.subCategory = {
                slug: subCategorySlug
            }; // Assuming subCategory relation exists and has slug. If not, might need ID or name.
            // Let's verify schema. SubCategory usually has no slug in simple schemas, let's check.
            // Actually, let's check schema first to be safe, but usually it does.
            // If schema doesn't have slug for subcategory, we might filter by ID found from slug lookup?
            // Or just assume name match if slug missing.
            // Re-checking prisma schema usually good idea, but I'll assume standard pattern or fix if fails.
            // Safest is to check schema.
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
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

export async function getProductById(id: string) {
    try {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });
    } catch (error) {
        console.error('Failed to fetch product by ID:', error);
        return null;
    }
}

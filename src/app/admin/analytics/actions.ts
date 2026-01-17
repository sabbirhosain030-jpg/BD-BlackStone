'use server';

import { prisma } from '@/lib/prisma';

/**
 * Get order trends for the last N days
 */
export async function getOrderTrends(days: number = 30) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = await prisma.order.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            _sum: { total: true },
            where: {
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Format data for Recharts
        const formattedData = orders.map(order => ({
            date: new Date(order.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            orders: order._count.id,
            revenue: order._sum.total || 0
        }));

        return formattedData;
    } catch (error) {
        console.error('Failed to fetch order trends:', error);
        return [];
    }
}

/**
 * Get top selling products
 */
export async function getTopProducts(limit: number = 10) {
    try {
        const products = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            _count: { id: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit
        });

        // Get product details
        const productDetails = await Promise.all(
            products.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true }
                });
                return {
                    name: product?.name || 'Unknown',
                    sold: item._sum.quantity || 0,
                    orders: item._count.id
                };
            })
        );

        return productDetails;
    } catch (error) {
        console.error('Failed to fetch top products:', error);
        return [];
    }
}

/**
 * Get revenue summary
 */
export async function getRevenueSummary() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        const [todayRevenue, monthRevenue, lastMonthRevenue, totalRevenue] = await Promise.all([
            prisma.order.aggregate({
                _sum: { total: true },
                where: { createdAt: { gte: today }, status: { not: 'CANCELLED' } }
            }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { createdAt: { gte: thisMonth }, status: { not: 'CANCELLED' } }
            }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    createdAt: { gte: lastMonth, lt: thisMonth },
                    status: { not: 'CANCELLED' }
                }
            }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { status: 'DELIVERED' }
            })
        ]);

        const monthGrowth = lastMonthRevenue._sum.total
            ? ((monthRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / (lastMonthRevenue._sum.total || 1) * 100
            : 0;

        return {
            today: todayRevenue._sum.total || 0,
            thisMonth: monthRevenue._sum.total || 0,
            lastMonth: lastMonthRevenue._sum.total || 0,
            total: totalRevenue._sum.total || 0,
            monthGrowth: Math.round(monthGrowth * 10) / 10
        };
    } catch (error) {
        console.error('Failed to fetch revenue summary:', error);
        return {
            today: 0,
            thisMonth: 0,
            lastMonth: 0,
            total: 0,
            monthGrowth: 0
        };
    }
}

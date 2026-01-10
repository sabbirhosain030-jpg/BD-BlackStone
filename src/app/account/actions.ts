'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserOrders() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return { success: false, error: 'Not authenticated' };
        }

        const orders = await prisma.order.findMany({
            where: {
                customerEmail: session.user.email
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Serialize to plain JSON and back to handle Dates and deep nesting
        const serializedOrders = JSON.parse(JSON.stringify(orders));

        return { success: true, orders: serializedOrders };
    } catch (error) {
        console.error('Failed to fetch user orders:', error);
        return { success: false, error: 'Failed to load orders' };
    }
}

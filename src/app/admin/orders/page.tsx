import React from 'react';
import { getAdminOrders } from '../actions';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const orders = await getAdminOrders();

    return <OrdersClient initialOrders={orders} />;
}

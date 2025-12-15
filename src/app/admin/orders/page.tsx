import React from 'react';
import Link from 'next/link';
import { getAdminOrders } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await getAdminOrders();

    return (
        <div className="admin-orders">
            <div className="admin-header">
                <h1 className="admin-title">Orders</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        style={{
                            backgroundColor: 'var(--color-stone-surface)',
                            border: '1px solid var(--color-stone-border)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-white)',
                            outline: 'none'
                        }}
                    />
                    <button style={{
                        backgroundColor: 'var(--color-stone-surface)',
                        border: '1px solid var(--color-stone-border)',
                        color: 'var(--color-stone-text)',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                    }}>
                        Filter
                    </button>
                </div>
            </div>

            <div className="stone-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="recent-orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                const itemCount = order.items ? order.items.length : 0;
                                return (
                                    <tr key={order.id}>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--color-gold)' }}>{order.orderNumber}</td>
                                        <td style={{ color: 'var(--color-white)' }}>{order.customerName}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{itemCount} items</td>
                                        <td style={{ fontWeight: 600 }}>৳ {order.total.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <button style={{ color: 'var(--color-stone-text)', cursor: 'pointer', fontSize: '0.875rem' }}>View Details</button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone-text)' }}>
                                    No orders found in database.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

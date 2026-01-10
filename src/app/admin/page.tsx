import React from 'react';
import { getDashboardStats, getRecentOrders } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const stats = await getDashboardStats();
    const recentOrders = await getRecentOrders();

    return (
        <div className="dashboard">
            <div className="admin-header">
                <h1 className="admin-title">Dashboard</h1>
                <div className="date-display" style={{ color: 'var(--color-stone-text)' }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stone-card">
                    <div className="stone-card-title">Total Revenue (Delivered)</div>
                    <div className="stone-card-value">৳ {stats.totalRevenue.toLocaleString()}</div>
                    {/* Growth metric placeholder - requires historical data */}
                    {/* <div style={{ color: 'var(--color-success)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        +12.5% from last month
                    </div> */}
                </div>

                <div className="stone-card">
                    <div className="stone-card-title">Total Orders</div>
                    <div className="stone-card-value">{stats.totalOrders}</div>
                </div>

                <div className="stone-card">
                    <div className="stone-card-title">Total Products</div>
                    <div className="stone-card-value">{stats.totalProducts}</div>
                    <div style={{ color: 'var(--color-stone-text)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        {stats.lowStockCount} low stock items
                    </div>
                </div>

                <div className="stone-card">
                    <div className="stone-card-title">Active Customers</div>
                    <div className="stone-card-value">{stats.activeCustomers}</div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-white)' }}>
                Recent Orders
            </h2>

            <div className="stone-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="recent-orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: any) => (
                                <tr key={order.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{order.orderNumber}</td>
                                    <td style={{ color: 'var(--color-white)' }}>{order.customerName}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--color-white)', fontWeight: 500 }}>৳ {order.total.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone-text)' }}>
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

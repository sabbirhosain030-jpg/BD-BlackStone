'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    createdAt: Date;
    status: string;
    total: number;
    items?: any[];
}

interface OrdersClientProps {
    initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');
    const [showFilters, setShowFilters] = useState(false);

    // Filter orders based on search and filters
    const filteredOrders = useMemo(() => {
        let filtered = [...initialOrders];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.orderNumber.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query) ||
                order.customerEmail.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Apply date filter
        if (dateFilter !== 'ALL') {
            const now = new Date();
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.createdAt);
                const diffTime = Math.abs(now.getTime() - orderDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                switch (dateFilter) {
                    case 'TODAY':
                        return diffDays <= 1;
                    case 'WEEK':
                        return diffDays <= 7;
                    case 'MONTH':
                        return diffDays <= 30;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [initialOrders, searchQuery, statusFilter, dateFilter]);

    return (
        <div className="admin-orders">
            <div className="admin-header">
                <h1 className="admin-title">Orders</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search by order #, customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            backgroundColor: 'var(--color-stone-surface)',
                            border: '1px solid var(--color-stone-border)',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-white)',
                            outline: 'none',
                            minWidth: '250px'
                        }}
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            backgroundColor: showFilters ? 'var(--color-gold)' : 'var(--color-stone-surface)',
                            border: `1px solid ${showFilters ? 'var(--color-gold)' : 'var(--color-stone-border)'}`,
                            color: showFilters ? 'var(--color-charcoal)' : 'var(--color-white)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div style={{
                    background: 'rgba(44, 44, 46, 0.6)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-stone-text)', fontSize: '0.875rem', fontWeight: '600' }}>
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                backgroundColor: 'var(--color-stone-dark)',
                                border: '1px solid var(--color-stone-border)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-white)',
                                outline: 'none',
                                minWidth: '150px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-stone-text)', fontSize: '0.875rem', fontWeight: '600' }}>
                            Date Range
                        </label>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            style={{
                                backgroundColor: 'var(--color-stone-dark)',
                                border: '1px solid var(--color-stone-border)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-white)',
                                outline: 'none',
                                minWidth: '150px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="ALL">All Time</option>
                            <option value="TODAY">Today</option>
                            <option value="WEEK">Last 7 Days</option>
                            <option value="MONTH">Last 30 Days</option>
                        </select>
                    </div>

                    {(searchQuery || statusFilter !== 'ALL' || dateFilter !== 'ALL') && (
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('ALL');
                                    setDateFilter('ALL');
                                }}
                                style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Results Count */}
            <div style={{ marginBottom: '1rem', color: 'var(--color-stone-text)', fontSize: '0.875rem' }}>
                Showing <strong style={{ color: 'var(--color-white)' }}>{filteredOrders.length}</strong> of <strong style={{ color: 'var(--color-white)' }}>{initialOrders.length}</strong> orders
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
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
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
                                                <button style={{ color: 'var(--color-stone-text)', cursor: 'pointer', fontSize: '0.875rem', background: 'none', border: 'none' }}>
                                                    View Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone-text)' }}>
                                    {searchQuery || statusFilter !== 'ALL' || dateFilter !== 'ALL'
                                        ? 'No orders match your search criteria.'
                                        : 'No orders found in database.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

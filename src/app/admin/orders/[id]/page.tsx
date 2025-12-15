import React from 'react';
import { getOrderDetails, updateOrderStatus } from '../../actions';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await getOrderDetails(id);

    if (!order) {
        return <div style={{ color: 'white', padding: '2rem' }}>Order not found</div>;
    }

    return (
        <div className="order-details-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Order Details</h1>
                    <div style={{ color: 'var(--color-gold)', fontFamily: 'monospace', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        {order.orderNumber}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className={`status-badge status-${order.status.toLowerCase()}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                        {order.status}
                    </div>
                </div>
            </div>

            <div className="admin-grid-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="stone-card">
                        <div className="stone-card-title">Order Items</div>
                        <table className="recent-orders-table" style={{ marginTop: '1rem' }}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th style={{ textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ color: 'var(--color-white)', fontWeight: 500 }}>{item.product.name}</div>
                                            {(item.size || item.color) && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-text)' }}>
                                                    {item.size && `Size: ${item.size} `}
                                                    {item.color && `Color: ${item.color}`}
                                                </div>
                                            )}
                                        </td>
                                        <td>৳ {item.price.toLocaleString()}</td>
                                        <td>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-white)' }}>
                                            ৳ {(item.price * item.quantity).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {/* Subtotal Row */}
                                <tr style={{ borderTop: '2px solid var(--color-stone-border)' }}>
                                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>Subtotal</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>৳ {order.subtotal.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'right' }}>Delivery Charge ({order.deliveryZone})</td>
                                    <td style={{ textAlign: 'right' }}>৳ {order.deliveryCharge}</td>
                                </tr>
                                <tr style={{ backgroundColor: 'var(--color-stone-border)' }}>
                                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-white)' }}>Grand Total</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-gold)' }}>৳ {order.total.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="stone-card">
                        <div className="stone-card-title">Customer Details</div>
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-stone-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <span style={{ color: 'var(--color-white)', fontWeight: 500 }}>{order.customerName}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                {order.customerEmail}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                {order.customerPhone}
                            </div>
                        </div>
                    </div>

                    <div className="stone-card">
                        <div className="stone-card-title">Shipping Address</div>
                        <p style={{ marginTop: '0.5rem', color: 'var(--color-stone-light)', whiteSpace: 'pre-line' }}>
                            {order.shippingAddress}
                            <br />
                            {order.city} {order.postalCode && `- ${order.postalCode}`}
                        </p>
                    </div>

                    <div className="stone-card">
                        <div className="stone-card-title">Update Status</div>
                        <form action={async () => {
                            'use server';
                            // Simple workaround for demo: cycling through statuses or setting specific one
                            // Ideally this would be client component with valid server action call
                        }} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                            {/* Client Component Button would be better here for interactivity */}
                            <div className="status-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <StatusButton id={order.id} status="PROCESSING" current={order.status} />
                                <StatusButton id={order.id} status="SHIPPED" current={order.status} />
                                <StatusButton id={order.id} status="DELIVERED" current={order.status} />
                                <StatusButton id={order.id} status="CANCELLED" current={order.status} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Small client helper for status buttons
import { StatusUpdateButton } from './status-button';

function StatusButton({ id, status, current }: { id: string, status: string, current: string }) {
    // This is a placeholder. Real implementation needs client component
    return <StatusUpdateButton id={id} status={status} isCurrent={current === status} />
}

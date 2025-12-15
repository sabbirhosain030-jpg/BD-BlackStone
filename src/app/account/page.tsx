'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserOrders } from './actions';
import { Button } from '@/components/ui/Button';
import './account.css';

type Order = {
    id: string;
    orderNumber: string;
    createdAt: Date;
    status: string;
    total: number;
    items: {
        quantity: number;
        product: {
            name: string;
        };
    }[];
};

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            const fetchOrders = async () => {
                const result = await getUserOrders();
                if (result.success && result.orders) {
                    setOrders(result.orders);
                }
                setLoadingOrders(false);
            };
            fetchOrders();
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="container" style={{ padding: '4rem' }}>Loading account...</div>;
    }

    if (!session) return null;

    const userInitials = session.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="account-page">
            <div className="container">
                <div className="dashboard-grid">
                    {/* Sidebar */}
                    <aside className="dashboard-sidebar">
                        <div className="user-profile-summary">
                            <div className="user-avatar">{userInitials}</div>
                            <h3 className="user-name">{session.user?.name}</h3>
                            <p className="user-email">{session.user?.email}</p>
                        </div>
                        <nav className="dashboard-nav">
                            <div className="nav-item active">My Orders</div>
                            <div className="nav-item" onClick={() => signOut({ callbackUrl: '/' })}>Logout</div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="dashboard-content">
                        <section className="dashboard-section">
                            <h2 className="section-title">Order History</h2>

                            {loadingOrders ? (
                                <p>Loading orders...</p>
                            ) : orders.length > 0 ? (
                                <div className="orders-list">
                                    {orders.map((order) => (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <div>
                                                    <span className="order-id">#{order.orderNumber}</span>
                                                    <div className="order-date">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <span className={`order-status status-${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order-items-preview">
                                                {order.items.slice(0, 2).map((item, idx) => (
                                                    <span key={idx}>
                                                        {item.quantity}x {item.product.name}
                                                        {idx < order.items.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                                {order.items.length > 2 && <span> + {order.items.length - 2} more</span>}
                                            </div>
                                            <div className="order-summary-row">
                                                <span>Total Amount</span>
                                                <span className="order-total">৳ {order.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p style={{ marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
                                    <Link href="/products">
                                        <Button variant="primary">Start Shopping</Button>
                                    </Link>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}

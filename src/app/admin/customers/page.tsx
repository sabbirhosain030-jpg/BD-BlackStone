'use client';

import { useEffect, useState } from 'react';
import { getAdminOrders } from '../actions';
import Link from 'next/link';
import '../admin.css';

interface Customer {
    email: string;
    name: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: Date;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const orders = await getAdminOrders();

                // Group orders by customer email
                const customerMap = new Map<string, Customer>();

                orders.forEach(order => {
                    const existing = customerMap.get(order.customerEmail);

                    if (existing) {
                        existing.totalOrders += 1;
                        existing.totalSpent += order.total;
                        if (new Date(order.createdAt) > existing.lastOrderDate) {
                            existing.lastOrderDate = new Date(order.createdAt);
                        }
                    } else {
                        customerMap.set(order.customerEmail, {
                            email: order.customerEmail,
                            name: order.customerName,
                            phone: order.customerPhone,
                            totalOrders: 1,
                            totalSpent: order.total,
                            lastOrderDate: new Date(order.createdAt)
                        });
                    }
                });

                const customerList = Array.from(customerMap.values())
                    .sort((a, b) => b.totalSpent - a.totalSpent);

                setCustomers(customerList);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-header">
                    <h1>Customers</h1>
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>Customers</h1>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>
                        Manage your customer base • {customers.length} total customers
                    </p>
                </div>
            </div>

            <div className="admin-section">
                <div className="admin-section-header">
                    <h2>Customer List</h2>
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            width: '300px'
                        }}
                    />
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Total Orders</th>
                                <th>Total Spent</th>
                                <th>Last Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                        {searchTerm ? 'No customers found matching your search.' : 'No customers yet.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.email}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{customer.name}</div>
                                        </td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>
                                            <span className="admin-badge" style={{
                                                backgroundColor: '#f0f0f0',
                                                color: '#333'
                                            }}>
                                                {customer.totalOrders}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600 }}>
                                                ৳{customer.totalSpent.toLocaleString()}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(customer.lastOrderDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredCustomers.length > 0 && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        display: 'flex',
                        gap: '2rem',
                        fontSize: '0.9rem'
                    }}>
                        <div>
                            <strong>Total Customers:</strong> {filteredCustomers.length}
                        </div>
                        <div>
                            <strong>Total Revenue:</strong> ৳{filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                        </div>
                        <div>
                            <strong>Average Order Value:</strong> ৳{Math.round(filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / filteredCustomers.reduce((sum, c) => sum + c.totalOrders, 0)).toLocaleString()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

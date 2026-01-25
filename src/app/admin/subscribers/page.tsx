'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../admin.css';

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubscribers();
    }, []);

    const loadSubscribers = async () => {
        try {
            const response = await fetch('/api/admin/subscribers');
            const data = await response.json();
            setSubscribers(data);
        } catch (error) {
            console.error('Failed to load subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const csv = 'Email,Date Subscribed\n' + subscribers.map(s =>
            `${s.email},${new Date(s.createdAt).toLocaleDateString()}`
        ).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div style={{ color: 'var(--color-white)' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <div>
                    <h1>Email Subscribers</h1>
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-stone-text)' }}>
                        {subscribers.length} total subscriber{subscribers.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    className="admin-btn-primary"
                    style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                    onClick={exportToCSV}
                >
                    Export to CSV
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Subscribed On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.length > 0 ? (
                            subscribers.map((subscriber) => (
                                <tr key={subscriber.id}>
                                    <td style={{ fontWeight: 500 }}>{subscriber.email}</td>
                                    <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this subscriber?')) {
                                                        // Add delete logic here
                                                        alert('Delete functionality would go here');
                                                    }
                                                }}
                                                style={{ color: 'var(--color-error)' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone-text)' }}>
                                    No subscribers yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

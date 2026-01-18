import React from 'react';
import { getAllSubscribers } from '../actions';
import Link from 'next/link';
import '../admin.css';

export const revalidate = 0;

export default async function SubscribersPage() {
    const subscribers = await getAllSubscribers();

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
                    onClick={() => {
                        const csv = 'Email,Date Subscribed\n' + subscribers.map(s =>
                            `${s.email},${new Date(s.createdAt).toLocaleDateString()}`
                        ).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                    }}
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
                                    <td style={{ color: 'var(--color-white)' }}>{subscriber.email}</td>
                                    <td>{new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</td>
                                    <td>
                                        <form action={async () => {
                                            'use server';
                                            const { deleteSubscriber } = await import('../actions');
                                            await deleteSubscriber(subscriber.id);
                                        }}>
                                            <button
                                                type="submit"
                                                className="btn-delete"
                                                style={{
                                                    background: '#d42c2c',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone-text)' }}>
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

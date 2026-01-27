'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminSettingsPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });

            if (res.ok) {
                setMessage(`User role updated to ${newRole}`);
                setTimeout(() => setMessage(''), 3000);
                fetchUsers();
            } else {
                setError('Failed to update user role');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Error updating user role');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-header">
                    <h1>Admin Settings</h1>
                </div>
                <div className="admin-card">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Settings</h1>
                <p className="admin-subtitle">Manage users and system administrators</p>
            </div>

            {message && (
                <div className="alert alert-success">
                    ✅ {message}
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    ❌ {error}
                </div>
            )}

            <div className="admin-card">
                <div className="card-header">
                    <h2>Current Admin</h2>
                </div>
                <div className="card-body">
                    <div className="admin-info-grid">
                        <div className="info-item">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{session?.user?.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{session?.user?.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Role:</span>
                            <span className="badge badge-admin">{(session?.user as any)?.role || 'USER'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="card-header">
                    <h2>All Users</h2>
                    <p>Manage user roles and permissions</p>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-name">
                                                {user.name}
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {user.email !== session?.user?.email && (
                                                <select
                                                    className="role-select"
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            )}
                                            {user.email === session?.user?.email && (
                                                <span className="text-muted">Current User</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .info-label {
                    font-size: 0.875rem;
                    color: #888;
                    font-weight: 500;
                }

                .info-value {
                    font-size: 1rem;
                    color: #fff;
                    font-weight: 600;
                }

                .badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .badge-admin {
                    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
                    color: #1a1a1a;
                }

                .badge-user {
                    background: #333;
                    color: #888;
                }

                .user-name {
                    font-weight: 600;
                    color: #fff;
                }

                .role-select {
                    padding: 0.5rem 0.75rem;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    color: #fff;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .role-select:hover {
                    border-color: #d4af37;
                }

                .role-select:focus {
                    outline: none;
                    border-color: #d4af37;
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                }

                .text-muted {
                    color: #666;
                    font-size: 0.875rem;
                }

                .alert {
                    padding: 1rem 1.25rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-weight: 500;
                }

                .alert-success {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #22c55e;
                }

                .alert-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                }
            `}</style>
        </div>
    );
}

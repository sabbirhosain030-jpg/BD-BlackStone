'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import './settings.css';

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
                    <div className="card-body">
                        <p>Loading...</p>
                    </div>
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
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { updateAdminCredentials } from './actions';
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

            {/* Admin Credential Change Section */}
            <div className="admin-card">
                <div className="card-header">
                    <h2>Change Admin Credentials</h2>
                    <p>Update your email address or password</p>
                </div>
                <div className="card-body">
                    <form action={async (formData) => {
                        const result = await updateAdminCredentials(formData);
                        if (result.success) {
                            setMessage(result.message || 'Credentials updated successfully');
                            if (result.emailChanged) {
                                setMessage('✅ Email updated! Please log in again with new credentials.');
                                setTimeout(() => {
                                    window.location.href = '/admin/login';
                                }, 2500);
                            } else {
                                setTimeout(() => setMessage(''), 3000);
                            }
                        } else {
                            setError(result.error || 'Failed to update credentials');
                            setTimeout(() => setError(''), 5000);
                        }
                    }} className="credentials-form">

                        <div className="form-section">
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#333' }}>Email Address</h3>
                            <div className="form-group">
                                <label htmlFor="newEmail" style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>New Email (optional)</label>
                                <input
                                    type="email"
                                    id="newEmail"
                                    name="newEmail"
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder={session?.user?.email || 'admin@blackstone.com'}
                                />
                                <small style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginTop: '0.25rem' }}>Leave blank to keep current email</small>
                            </div>
                        </div>

                        <div className="form-section" style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#333' }}>Password</h3>
                            <div className="form-group">
                                <label htmlFor="currentPassword" style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Current Password <span style={{ color: '#d32f2f' }}>*</span></label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label htmlFor="newPassword" style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>New Password (optional)</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    minLength={8}
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder="Minimum 8 characters"
                                />
                                <small style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginTop: '0.25rem' }}>Leave blank to keep current password</small>
                            </div>

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label htmlFor="confirmPassword" style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    style={{
                                        width: '100%',
                                        padding: '0.625rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder="Re-enter new password"
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000'}
                            >
                                Update Credentials
                            </button>
                            <p style={{
                                fontSize: '0.75rem',
                                color: '#d32f2f',
                                marginTop: '0.75rem',
                                fontStyle: 'italic'
                            }}>
                                ⚠️ You must enter your current password to make any changes
                            </p>
                        </div>
                    </form>
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

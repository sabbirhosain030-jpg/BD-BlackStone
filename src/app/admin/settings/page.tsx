'use client';

import { useState, useEffect, useRef } from 'react';
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

// ── Password field with show/hide toggle ──────────────────────
function PasswordField({
    id,
    name,
    label,
    placeholder,
    required,
    minLength,
    hint,
}: {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    hint?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="settings-field">
            <label htmlFor={id} className="settings-label">
                {label}{required && <span className="settings-required"> *</span>}
            </label>
            <div className="settings-input-wrap">
                <input
                    id={id}
                    name={name}
                    type={show ? 'text' : 'password'}
                    className="settings-input"
                    placeholder={placeholder}
                    required={required}
                    minLength={minLength}
                    autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                />
                <button
                    type="button"
                    className="settings-eye"
                    onClick={() => setShow(s => !s)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                >
                    {show ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
            {hint && <small className="settings-hint">{hint}</small>}
        </div>
    );
}

export default function AdminSettingsPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [passError, setPassError] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) setUsers(await res.json());
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            });
            if (res.ok) {
                setMessage(`User role updated to ${newRole}`);
                setTimeout(() => setMessage(''), 3000);
                fetchUsers();
            } else {
                setError('Failed to update user role');
                setTimeout(() => setError(''), 3000);
            }
        } catch {
            setError('Error updating user role');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleCredentialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPassError('');

        const fd = new FormData(e.currentTarget);
        const newPass = fd.get('newPassword') as string;
        const confirmPass = fd.get('confirmPassword') as string;

        // Client-side password match check
        if (newPass && newPass !== confirmPass) {
            setPassError('New passwords do not match.');
            return;
        }
        if (newPass && newPass.length < 8) {
            setPassError('New password must be at least 8 characters.');
            return;
        }

        setSubmitting(true);
        const result = await updateAdminCredentials(fd);
        setSubmitting(false);

        if (result.success) {
            setMessage(result.message || 'Credentials updated successfully');
            formRef.current?.reset();
            if (result.emailChanged) {
                setMessage('✅ Email updated — redirecting to login…');
                setTimeout(() => { window.location.href = '/admin/login'; }, 2500);
            } else {
                setTimeout(() => setMessage(''), 4000);
            }
        } else {
            setPassError(result.error || 'Failed to update credentials');
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-header"><h1 className="admin-title">Admin Settings</h1></div>
                <div className="stone-card"><div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Loading…</div></div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="admin-title">Admin Settings</h1>
                <p style={{ color: '#888', marginTop: '0.25rem', fontSize: '0.9rem' }}>Manage credentials and user roles</p>
            </div>

            {/* Global alerts */}
            {message && (
                <div className="settings-alert settings-alert-success">✅ {message}</div>
            )}
            {error && (
                <div className="settings-alert settings-alert-error">❌ {error}</div>
            )}

            {/* ── Current Admin Info ── */}
            <div className="stone-card" style={{ marginBottom: '1.5rem' }}>
                <div className="stone-card-title">Current Admin</div>
                <div className="settings-info-grid">
                    <div className="settings-info-row">
                        <span className="settings-info-label">Name</span>
                        <span className="settings-info-value">{session?.user?.name || '—'}</span>
                    </div>
                    <div className="settings-info-row">
                        <span className="settings-info-label">Email</span>
                        <span className="settings-info-value">{session?.user?.email || '—'}</span>
                    </div>
                    <div className="settings-info-row">
                        <span className="settings-info-label">Role</span>
                        <span className="settings-badge settings-badge-admin">
                            {(session?.user as any)?.role || 'USER'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Change Credentials ── */}
            <div className="stone-card" style={{ marginBottom: '1.5rem' }}>
                <div className="stone-card-title">Change Credentials</div>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Update your email or password. Current password is always required.
                </p>

                {passError && (
                    <div className="settings-alert settings-alert-error" style={{ marginBottom: '1rem' }}>
                        ❌ {passError}
                    </div>
                )}

                <form ref={formRef} onSubmit={handleCredentialSubmit} className="settings-form">

                    {/* Email section */}
                    <div className="settings-section">
                        <div className="settings-section-title">Email Address</div>
                        <div className="settings-field">
                            <label htmlFor="newEmail" className="settings-label">
                                New Email <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                                id="newEmail"
                                name="newEmail"
                                type="email"
                                className="settings-input"
                                placeholder={session?.user?.email || 'admin@blackstone.com'}
                                autoComplete="email"
                            />
                            <small className="settings-hint">Leave blank to keep current email</small>
                        </div>
                    </div>

                    {/* Password section */}
                    <div className="settings-section">
                        <div className="settings-section-title">Password</div>

                        <PasswordField
                            id="currentPassword"
                            name="currentPassword"
                            label="Current Password"
                            placeholder="Enter your current password"
                            required
                        />

                        <PasswordField
                            id="newPassword"
                            name="newPassword"
                            label="New Password"
                            placeholder="Minimum 8 characters"
                            minLength={8}
                            hint="Leave blank to keep current password"
                        />

                        <PasswordField
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm New Password"
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <div className="settings-form-footer">
                        <button
                            type="submit"
                            className="admin-btn-primary"
                            disabled={submitting}
                            style={{ minWidth: '180px' }}
                        >
                            {submitting ? 'Updating…' : 'Update Credentials'}
                        </button>
                        <p className="settings-warning">
                            ⚠️ Current password is required to save any changes
                        </p>
                    </div>
                </form>
            </div>

            {/* ── All Users ── */}
            <div className="stone-card">
                <div className="stone-card-title">All Users</div>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Manage user roles and permissions
                </p>
                <div className="admin-table-container">
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
                                    <td data-label="Name">{user.name}</td>
                                    <td data-label="Email" style={{ fontSize: '0.85rem' }}>{user.email}</td>
                                    <td data-label="Role">
                                        <span className={`settings-badge ${user.role === 'ADMIN' ? 'settings-badge-admin' : 'settings-badge-user'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td data-label="Joined">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td data-label="Actions">
                                        {user.email !== session?.user?.email ? (
                                            <select
                                                className="settings-role-select"
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            >
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        ) : (
                                            <span style={{ color: '#666', fontSize: '0.8rem' }}>You</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

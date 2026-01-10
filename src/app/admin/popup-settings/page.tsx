'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function PopupSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        isEnabled: true,
        title: 'GET 12% OFF YOUR FIRST ORDER',
        subtitle: 'And be the first to hear about our new product drops!',
        discountPercent: 12,
        couponPrefix: 'WELCOME',
        buttonText: 'GET 12% OFF'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [subscribers, setSubscribers] = useState([]);

    useEffect(() => {
        loadSettings();
        loadSubscribers();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/popup-settings');
            const data = await res.json();
            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSubscribers = async () => {
        try {
            const res = await fetch('/api/admin/subscribers');
            const data = await res.json();
            setSubscribers(data);
        } catch (error) {
            console.error('Failed to load subscribers:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/admin/popup-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-container"><p>Loading...</p></div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Email Popup Settings</h1>
                <button onClick={() => router.push('/admin')} className="btn-secondary">
                    Back to Dashboard
                </button>
            </div>

            <form onSubmit={handleSave} className="admin-form">
                <div className="form-section">
                    <h2>Popup Configuration</h2>

                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={settings.isEnabled}
                            onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
                        />
                        <span>Enable Popup</span>
                    </label>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            value={settings.subtitle}
                            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Discount Percentage</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={settings.discountPercent}
                            onChange={(e) => setSettings({ ...settings, discountPercent: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Coupon Prefix</label>
                        <input
                            type="text"
                            value={settings.couponPrefix}
                            onChange={(e) => setSettings({ ...settings, couponPrefix: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Button Text</label>
                        <input
                            type="text"
                            value={settings.buttonText}
                            onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>

            <div className="admin-section" style={{ marginTop: '3rem' }}>
                <h2>Email Subscribers ({subscribers.length})</h2>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Coupon Code</th>
                                <th>Subscribed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((sub: any) => (
                                <tr key={sub.id}>
                                    <td>{sub.email}</td>
                                    <td><strong>{sub.couponCode || 'N/A'}</strong></td>
                                    <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {subscribers.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No subscribers yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

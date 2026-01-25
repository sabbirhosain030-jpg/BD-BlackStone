'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../admin.css';

export default function PopupDisplaySettings() {
    const [settings, setSettings] = useState({
        isEnabled: false,
        title: '',
        message: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch('/api/popup-settings');
            const data = await response.json();
            setSettings({
                isEnabled: data.isEnabled,
                title: data.title || '',
                message: data.message || ''
            });
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/popup-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                alert('Display settings saved successfully!');
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ color: 'var(--color-white)', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div className="popup-display-settings">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">🎯 Popup Display Settings</h1>
                    <p style={{ color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                        Control popup visibility and customize the main message
                    </p>
                </div>
                <Link href="/admin/popup-settings">
                    <button className="btn btn-secondary">← Back to Dashboard</button>
                </Link>
            </div>

            <div className="stone-card" style={{ maxWidth: '600px', marginTop: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={settings.isEnabled}
                                onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ color: 'var(--color-white)', fontWeight: 600 }}>
                                    Enable Popup
                                </div>
                                <div style={{ color: 'var(--color-stone-text)', fontSize: '0.875rem' }}>
                                    Show marketing popup to visitors
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Popup Title</label>
                        <input
                            type="text"
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            className="form-input"
                            placeholder="e.g., Special Offer!"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Popup Message</label>
                        <textarea
                            value={settings.message}
                            onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                            className="form-input"
                            rows={4}
                            placeholder="Your special offer message..."
                            required
                        />
                    </div>

                    <button type="submit" className="admin-btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Display Settings'}
                    </button>
                </form>
            </div>
        </div>
    );
}

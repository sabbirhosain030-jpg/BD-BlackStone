'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../admin.css';

export default function CountdownSettings() {
    const [settings, setSettings] = useState({
        showCountdown: false,
        offerEndTime: '',
        countdownText: ''
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

            // Format date for input if it exists
            let formattedDate = '';
            if (data.offerEndTime) {
                const date = new Date(data.offerEndTime);
                // HTML datetime-local expects YYYY-MM-DDThh:mm
                const offset = date.getTimezoneOffset() * 60000;
                formattedDate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
            }

            setSettings({
                showCountdown: data.showCountdown || false,
                offerEndTime: formattedDate,
                countdownText: data.countdownText || 'Offer ends in:'
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
            // Convert local time back to ISO string for storage
            const isoDate = settings.offerEndTime ? new Date(settings.offerEndTime).toISOString() : null;

            const response = await fetch('/api/popup-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    showCountdown: settings.showCountdown,
                    offerEndTime: isoDate,
                    countdownText: settings.countdownText
                })
            });

            if (response.ok) {
                alert('Countdown settings saved successfully!');
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
        <div className="countdown-settings">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">⏱️ Countdown Timer</h1>
                    <p style={{ color: 'var(--color-stone-text)', marginTop: '0.5rem' }}>
                        Create urgency with a countdown timer
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
                                checked={settings.showCountdown}
                                onChange={(e) => setSettings({ ...settings, showCountdown: e.target.checked })}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ color: 'var(--color-white)', fontWeight: 600 }}>
                                    Enable Countdown Timer
                                </div>
                                <div style={{ color: 'var(--color-stone-text)', fontSize: '0.875rem' }}>
                                    Show a ticking timer in the popup
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Offer End Time</label>
                        <input
                            type="datetime-local"
                            value={settings.offerEndTime}
                            onChange={(e) => setSettings({ ...settings, offerEndTime: e.target.value })}
                            className="form-input"
                            style={{ colorScheme: 'dark' }} // Makes calendar dark mode friendly
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Countdown Label</label>
                        <input
                            type="text"
                            value={settings.countdownText}
                            onChange={(e) => setSettings({ ...settings, countdownText: e.target.value })}
                            className="form-input"
                            placeholder="e.g., Offer ends in:"
                        />
                    </div>

                    <div style={{
                        background: 'var(--color-stone-dark)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-stone-border)',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-white)', marginBottom: '0.5rem' }}>
                            {settings.countdownText || 'Offer ends in:'}
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            color: 'var(--color-gold)',
                            fontWeight: 700,
                            fontFamily: 'monospace'
                        }}>
                            02 : 14 : 35 : 12
                        </div>
                    </div>

                    <button type="submit" className="admin-btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Timer Settings'}
                    </button>
                </form>
            </div>
        </div>
    );
}

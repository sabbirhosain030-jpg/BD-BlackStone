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
    const [activeTab, setActiveTab] = useState('settings');

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

    if (loading) return (
        <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="admin-loading-spinner"></div>
        </div>
    );

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Marketing Popup</h1>
                    <p className="admin-subtitle">Manage your website's promotional popup and subscribers</p>
                </div>
                <button onClick={() => router.push('/admin')} className="btn btn-secondary">
                    Back to Dashboard
                </button>
            </div>

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings & Preview
                </button>
                <button
                    className={`admin-tab ${activeTab === 'subscribers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('subscribers')}
                >
                    Subscribers ({subscribers.length})
                </button>
            </div>

            {activeTab === 'settings' ? (
                <div className="popup-settings-grid">
                    <div className="stone-card">
                        <h2 className="card-title">Configuration</h2>
                        <form onSubmit={handleSave} className="admin-form">
                            <div className="form-group toggle-group">
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="font-medium">Enable Popup</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={settings.isEnabled}
                                            onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
                                        />
                                        <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${settings.isEnabled ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.isEnabled ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Headline Title</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    value={settings.title}
                                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                    required
                                    placeholder="e.g. GET 10% OFF"
                                />
                            </div>

                            <div className="form-group">
                                <label>Subtitle / Description</label>
                                <textarea
                                    className="admin-input"
                                    value={settings.subtitle}
                                    onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                    required
                                    rows={3}
                                    placeholder="e.g. Subscribe to our newsletter..."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Discount %</label>
                                    <input
                                        type="number"
                                        className="admin-input"
                                        min="0"
                                        max="100"
                                        value={settings.discountPercent}
                                        onChange={(e) => setSettings({ ...settings, discountPercent: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>

                                <div className="form-group half">
                                    <label>Coupon Prefix</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={settings.couponPrefix}
                                        onChange={(e) => setSettings({ ...settings, couponPrefix: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Button Text</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    value={settings.buttonText}
                                    onChange={(e) => setSettings({ ...settings, buttonText: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Configuration'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="stone-card preview-card">
                        <h2 className="card-title">Live Preview</h2>
                        <div className="popup-preview-container">
                            <div className="popup-preview-box">
                                <div className="popup-preview-content">
                                    <div className="popup-preview-close">×</div>
                                    <h3 className="popup-preview-title">{settings.title}</h3>
                                    <p className="popup-preview-subtitle">{settings.subtitle}</p>

                                    <div className="popup-preview-form">
                                        <input type="email" placeholder="Enter your email address" disabled />
                                        <button className="popup-preview-btn">{settings.buttonText}</button>
                                    </div>

                                    <p className="popup-preview-note">No thanks, I prefer paying full price</p>
                                </div>
                            </div>
                        </div>
                        <p className="preview-caption">
                            This is how the popup will appear to visitors. The styling automatically matches your current site theme.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="stone-card">
                    <div className="card-header">
                        <h2>Subscriber List</h2>
                        <button className="btn btn-sm btn-ghost">Export CSV</button>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Email Address</th>
                                    <th>Coupon Assigned</th>
                                    <th>Date Subscribed</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.length > 0 ? (
                                    subscribers.map((sub: any) => (
                                        <tr key={sub.id}>
                                            <td style={{ fontWeight: 500 }}>{sub.email}</td>
                                            <td>
                                                <span className="coupon-badge">{sub.couponCode || 'N/A'}</span>
                                            </td>
                                            <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                                            <td><span className="status-badge status-active">Active</span></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="empty-state">
                                            No subscribers yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <style jsx>{`
                .popup-settings-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                
                .admin-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--color-border);
                }
                
                .admin-tab {
                    padding: 0.75rem 1.5rem;
                    background: none;
                    border: none;
                    border-bottom: 3px solid transparent;
                    color: var(--color-text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .admin-tab.active {
                    color: var(--color-gold);
                    border-bottom-color: var(--color-gold);
                }
                
                .popup-preview-container {
                    background: rgba(0,0,0,0.7);
                    padding: 2rem;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                    background-image: url('/hero_fashion_1765713862724.png');
                    background-size: cover;
                    position: relative;
                }
                
                .popup-preview-container::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    border-radius: 8px;
                }
                
                .popup-preview-box {
                    background: white;
                    padding: 2rem;
                    border-radius: 4px;
                    width: 100%;
                    max-width: 320px;
                    text-align: center;
                    position: relative;
                    z-index: 10;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }
                
                .popup-preview-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    color: #1a1a1a;
                    margin-bottom: 0.5rem;
                    line-height: 1.2;
                }
                
                .popup-preview-subtitle {
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                }
                
                .popup-preview-form input {
                    width: 100%;
                    padding: 0.75rem;
                    margin-bottom: 0.75rem;
                    border: 1px solid #ddd;
                    font-size: 0.9rem;
                }
                
                .popup-preview-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: #1a1a1a;
                    color: white;
                    border: none;
                    text-transform: uppercase;
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                }
                
                .popup-preview-note {
                    margin-top: 1rem;
                    font-size: 0.75rem;
                    color: #999;
                    text-decoration: underline;
                    cursor: pointer;
                }
                
                .popup-preview-close {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                }
                
                .preview-caption {
                    margin-top: 1rem;
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                    font-style: italic;
                    text-align: center;
                }
                
                .coupon-badge {
                    background: rgba(212, 175, 55, 0.15);
                    color: var(--color-gold);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-family: monospace;
                    font-weight: 600;
                }
                
                @media (max-width: 900px) {
                    .popup-settings-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

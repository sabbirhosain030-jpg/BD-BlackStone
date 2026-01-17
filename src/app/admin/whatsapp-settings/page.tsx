import React from 'react';
import { getWhatsAppSettings, updateWhatsAppSettings } from './actions';
import { redirect } from 'next/navigation';
import '../admin.css';

export default async function WhatsAppSettingsPage() {
    const settings = await getWhatsAppSettings();

    async function handleSubmit(formData: FormData) {
        'use server';
        const result = await updateWhatsAppSettings(formData);
        if (result.success) {
            redirect('/admin/whatsapp-settings?saved=true');
        }
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>WhatsApp Settings</h1>
                <p className="admin-subtitle">
                    Configure WhatsApp integration for order notifications
                </p>
            </div>

            <div className="admin-card">
                <form action={handleSubmit} className="admin-form">
                    <div className="form-section">
                        <h2>Business Information</h2>

                        <div className="form-group">
                            <label htmlFor="businessPhone" className="required">
                                WhatsApp Business Number
                            </label>
                            <input
                                type="text"
                                id="businessPhone"
                                name="businessPhone"
                                defaultValue={settings?.businessPhone}
                                placeholder="8801XXXXXXXXX"
                                required
                                className="form-input"
                            />
                            <p className="form-help">
                                Enter phone number with country code (e.g., 8801712345678 for Bangladesh).
                                Do not include + or spaces.
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="welcomeMessage">
                                Welcome Message
                            </label>
                            <textarea
                                id="welcomeMessage"
                                name="welcomeMessage"
                                defaultValue={settings?.welcomeMessage}
                                rows={3}
                                className="form-input"
                                placeholder="Hello! Thank you for shopping with BD BlackStone."
                            />
                            <p className="form-help">
                                Optional message to include in customer WhatsApp notifications
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isEnabled"
                                    defaultChecked={settings?.isEnabled}
                                />
                                <span>Enable WhatsApp Integration</span>
                            </label>
                            <p className="form-help">
                                When enabled, customers will see a WhatsApp button on the order success page
                            </p>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Save Settings
                        </button>
                    </div>
                </form>

                <div className="admin-card" style={{ marginTop: '2rem', background: '#1a1a1a' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Preview</h3>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Test your WhatsApp integration:
                    </p>
                    {settings?.businessPhone && settings.businessPhone !== '8801XXXXXXXXX' ? (
                        <a
                            href={`https://wa.me/${settings.businessPhone}?text=${encodeURIComponent(settings.welcomeMessage || 'Hello!')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                background: '#25D366',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            📱 Test WhatsApp Link
                        </a>
                    ) : (
                        <p style={{ color: '#ff6b6b' }}>
                            Please save a valid phone number to test the WhatsApp integration
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

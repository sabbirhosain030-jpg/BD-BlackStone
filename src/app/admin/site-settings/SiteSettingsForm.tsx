'use client';

import React, { useState } from 'react';
import { updateSiteSettings } from '../actions';
import '../admin.css';

interface SiteSettings {
    id?: string;
    siteName: string;
    siteTagline: string;
    contactEmail: string;
    contactPhone: string;
    alternatePhones: string[];
    address: string;
    googleMapsUrl: string;
    googleMapsEmbed: string;
    facebookUrl: string;
    instagramUrl: string;
    twitterUrl: string;
    linkedinUrl: string;
    whatsappNumber: string;
    businessHours: string;
}

export default function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
    const [formData, setFormData] = useState<SiteSettings>(settings || {
        siteName: 'Black Stone',
        siteTagline: 'Premium Professional Clothing',
        contactEmail: 'contact@blackstone.com',
        contactPhone: '+880',
        alternatePhones: [],
        address: 'Dhaka, Bangladesh',
        googleMapsUrl: '',
        googleMapsEmbed: '',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        linkedinUrl: '',
        whatsappNumber: '',
        businessHours: 'Mon-Sat: 9AM-9PM'
    });

    const [newPhone, setNewPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const result = await updateSiteSettings(formData);
            if (result.success) {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Error saving settings');
            }
        } catch (error) {
            setMessage('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const addPhone = () => {
        if (newPhone && !formData.alternatePhones.includes(newPhone)) {
            setFormData({
                ...formData,
                alternatePhones: [...formData.alternatePhones, newPhone]
            });
            setNewPhone('');
        }
    };

    const removePhone = (phone: string) => {
        setFormData({
            ...formData,
            alternatePhones: formData.alternatePhones.filter(p => p !== phone)
        });
    };

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Site Settings</h1>
                <p style={{ marginTop: '0.5rem', color: 'var(--color-stone-text)' }}>
                    Manage your business information and contact details
                </p>
            </div>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    background: message.includes('success') ?
                        'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)' :
                        'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)',
                    border: message.includes('success') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--color-white)'
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form">
                {/* Basic Info */}
                <div className="stone-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-white)' }}>
                        Basic Information
                    </h2>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Site Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tagline</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.siteTagline}
                                onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Business Hours</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.businessHours}
                            onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                            placeholder="Mon-Sat: 9AM-9PM"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="stone-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-white)' }}>
                        Contact Information
                    </h2>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Primary Phone</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alternate Phone Numbers</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                type="tel"
                                className="form-input"
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                placeholder="+880 XXX XXXX"
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={addPhone}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--color-gold)',
                                    color: 'var(--color-charcoal)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Add
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {formData.alternatePhones.map((phone) => (
                                <span
                                    key={phone}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(212, 175, 55, 0.1)',
                                        border: '1px solid rgba(212, 175, 55, 0.3)',
                                        borderRadius: '20px',
                                        color: 'var(--color-gold)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    {phone}
                                    <button
                                        type="button"
                                        onClick={() => removePhone(phone)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-gold)',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">WhatsApp Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={formData.whatsappNumber}
                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            placeholder="+880 XXX XXXX"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-input"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>
                </div>

                {/* Google Maps */}
                <div className="stone-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-white)' }}>
                        Google Maps
                    </h2>

                    <div className="form-group">
                        <label className="form-label">Google Maps URL</label>
                        <input
                            type="url"
                            className="form-input"
                            value={formData.googleMapsUrl}
                            onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                            placeholder="https://maps.google.com/..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Google Maps Embed Code</label>
                        <textarea
                            className="form-input"
                            value={formData.googleMapsEmbed}
                            onChange={(e) => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
                            rows={4}
                            placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                        />
                    </div>
                </div>

                {/* Social Media */}
                <div className="stone-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-white)' }}>
                        Social Media
                    </h2>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Facebook</label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.facebookUrl}
                                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Instagram</label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.instagramUrl}
                                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Twitter</label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.twitterUrl}
                                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                                placeholder="https://twitter.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">LinkedIn</label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.linkedinUrl}
                                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="admin-btn-primary"
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
}

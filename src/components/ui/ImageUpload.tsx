'use client';

import React, { useState } from 'react';

interface ImageUploadProps {
    initialUrl?: string;
    onUpload: (url: string) => void;
    label?: string;
    required?: boolean;
}

export default function ImageUpload({ initialUrl, onUpload, label = "Product Image", required = false }: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(initialUrl || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset states
        setError('');
        setUploading(true);

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();

            if (data.url) {
                onUpload(data.url);
                // Keep the remote URL as preview (optional, but good for verification)
                setPreview(data.url);
            } else {
                throw new Error('No URL returned');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
            // Revert preview if upload failed
            setPreview(initialUrl || '');
        } finally {
            setUploading(false);
            // Cleanup object URL
            URL.revokeObjectURL(objectUrl);
        }
    };

    return (
        <div className="form-group">
            <label className="form-label">
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '2px dashed #444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {preview ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                            {uploading && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    Uploading...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 0.5rem' }}>
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <p>Click to upload image</p>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        required={required && !preview}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer'
                        }}
                    />
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

                {/* Hidden input to store the URL so it gets submitted with the form if needed, 
                    though ProductForm handles state via onUpload callback usually or hidden input */}
                <input type="hidden" name="imageUrl" value={preview?.startsWith('blob:') ? '' : preview || ''} />
            </div>
        </div>
    );
}

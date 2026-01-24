'use client';

import React, { useState } from 'react';

interface MultiImageUploadProps {
    initialUrls?: string[];
    onUpload: (urls: string[]) => void;
    label?: string;
    required?: boolean;
}

export default function MultiImageUpload({
    initialUrls = [],
    onUpload,
    label = "Product Images",
    required = false
}: MultiImageUploadProps) {
    const [images, setImages] = useState<string[]>(initialUrls);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const inputId = React.useId(); // Unique ID for label-input pairing

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Reset error
        setError('');
        setUploading(true);

        const newUrls: string[] = [];
        const errors: string[] = [];

        // Upload each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Basic client-side validation for roughly 5MB
            if (file.size > 5 * 1024 * 1024) {
                errors.push(`${file.name} (Too large, max 5MB)`);
                continue;
            }

            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) throw new Error(`Upload failed for ${file.name}`);

                const data = await res.json();
                if (data.url) {
                    newUrls.push(data.url);
                }
            } catch (err) {
                console.error(err);
                errors.push(`${file.name} (Upload failed)`);
            }
        }

        setUploading(false);

        if (errors.length > 0) {
            setError(`Error: ${errors.join(', ')}`);
        }

        if (newUrls.length > 0) {
            const updatedImages = [...images, ...newUrls];
            setImages(updatedImages);
            onUpload(updatedImages);
        }

        // Reset input so same files can be selected again if needed
        e.target.value = '';
    };

    const removeImage = (indexToRemove: number) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);
        onUpload(updatedImages);
    };

    return (
        <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                    {label} {required && images.length === 0 && <span style={{ color: 'red' }}>*</span>}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'normal' }}>
                    Recommended: 1:1 Aspect Ratio (Square) • Max 5MB
                </span>
            </label>

            <div className="multi-image-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                {images.map((url, index) => (
                    <div key={index} style={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                zIndex: 10
                            }}
                            title="Remove image"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* Upload Button Block */}
                <div>
                    <label
                        htmlFor={inputId}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            aspectRatio: '1/1',
                            border: '2px dashed #444',
                            borderRadius: '8px',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            backgroundColor: '#1a1a1a',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            height: '100%'
                        }}
                        onMouseEnter={(e) => {
                            if (!uploading) {
                                e.currentTarget.style.borderColor = 'var(--color-gold)';
                                e.currentTarget.style.backgroundColor = '#222';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!uploading) {
                                e.currentTarget.style.borderColor = '#444';
                                e.currentTarget.style.backgroundColor = '#1a1a1a';
                            }
                        }}
                    >
                        {uploading ? (
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Uploading...</span>
                        ) : (
                            <>
                                <span style={{ fontSize: '2rem', color: '#666', marginBottom: '0.25rem' }}>+</span>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Add</span>
                            </>
                        )}
                    </label>
                    <input
                        id={inputId}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>
    );
}

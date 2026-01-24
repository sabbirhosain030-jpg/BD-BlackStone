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
                errors.push(file.name);
            }
        }

        setUploading(false);

        if (errors.length > 0) {
            setError(`Failed to upload: ${errors.join(', ')}`);
        }

        if (newUrls.length > 0) {
            const updatedImages = [...images, ...newUrls];
            setImages(updatedImages);
            onUpload(updatedImages);
        }
    };

    const removeImage = (indexToRemove: number) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);
        onUpload(updatedImages);
    };

    return (
        <div className="form-group">
            <label className="form-label">
                {label} {required && images.length === 0 && <span style={{ color: 'red' }}>*</span>}
            </label>

            <div className="multi-image-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                {images.map((url, index) => (
                    <div key={index} style={{ position: 'relative', aspectRatio: '1/1' }}>
                        <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #333'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px'
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* Upload Button Block */}
                <div style={{
                    position: 'relative',
                    border: '2px dashed #444',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    aspectRatio: '1/1',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    backgroundColor: '#1a1a1a',
                    transition: 'all 0.2s ease'
                }}>
                    {uploading ? (
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>Uploading...</span>
                    ) : (
                        <>
                            <span style={{ fontSize: '2rem', color: '#666', marginBottom: '0.5rem' }}>+</span>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Add Image</span>
                        </>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: uploading ? 'not-allowed' : 'pointer'
                        }}
                    />
                </div>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>
    );
}

'use client';

import React, { useState } from 'react';

interface ColorPickerProps {
    label?: string;
    initialColors?: string[];
    onChange: (colors: string[]) => void;
    required?: boolean;
}

export default function ColorPicker({ label = 'Colors', initialColors = [], onChange, required = false }: ColorPickerProps) {
    const [colors, setColors] = useState<string[]>(initialColors);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    // Popular preset colors
    const presetColors = [
        '#000000', '#FFFFFF', '#1a1a1a', '#808080',
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FFA500', '#800080',
        '#008000', '#000080', '#800000', '#008080',
        '#C0C0C0', '#FFC0CB', '#FFD700', '#4B0082'
    ];

    const addColor = (color: string) => {
        if (!colors.includes(color)) {
            const newColors = [...colors, color];
            setColors(newColors);
            onChange(newColors);
        }
    };

    const removeColor = (colorToRemove: string) => {
        const newColors = colors.filter(c => c !== colorToRemove);
        setColors(newColors);
        onChange(newColors);
    };

    const addCustomColor = () => {
        if (currentColor && !colors.includes(currentColor)) {
            addColor(currentColor);
            setShowCustomPicker(false);
        }
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
                {label} {required && <span style={{ color: 'var(--color-gold)' }}>*</span>}
            </label>

            {/* Selected Colors Display */}
            <div style={{
                padding: '1rem',
                background: 'rgba(28, 28, 30, 0.4)',
                border: '1px solid var(--color-stone-border)',
                borderRadius: '8px',
                marginBottom: '1rem'
            }}>
                {colors.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {colors.map((color, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                    background: 'rgba(44, 44, 46, 0.8)',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <div
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '4px',
                                        backgroundColor: color,
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                />
                                <span style={{
                                    color: 'var(--color-white)',
                                    fontSize: '0.875rem',
                                    fontFamily: 'monospace'
                                }}>
                                    {color.toUpperCase()}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeColor(color)}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        width: '20px',
                                        height: '20px',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-stone-text)', margin: 0, fontSize: '0.875rem' }}>
                        No colors selected. Choose from presets below.
                    </p>
                )}
            </div>

            {/* Quick Presets */}
            <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'var(--color-stone-text)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Quick Select:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '0.5rem' }}>
                    {presetColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => addColor(color)}
                            disabled={colors.includes(color)}
                            style={{
                                width: '100%',
                                aspectRatio: '1',
                                backgroundColor: color,
                                border: colors.includes(color)
                                    ? '3px solid var(--color-gold)'
                                    : '2px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '6px',
                                cursor: colors.includes(color) ? 'not-allowed' : 'pointer',
                                opacity: colors.includes(color) ? 0.5 : 1,
                                transition: 'all 0.2s',
                                position: 'relative',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title={color}
                            onMouseOver={(e) => {
                                if (!colors.includes(color)) {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.zIndex = '10';
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.zIndex = '1';
                            }}
                        >
                            {colors.includes(color) && (
                                <span style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: color === '#FFFFFF' ? '#000' : '#fff',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}>
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Color Picker */}
            <div>
                {!showCustomPicker ? (
                    <button
                        type="button"
                        onClick={() => setShowCustomPicker(true)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '2px dashed rgba(212, 175, 55, 0.3)',
                            borderRadius: '6px',
                            color: 'var(--color-gold)',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                            e.currentTarget.style.borderColor = 'var(--color-gold)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        }}
                    >
                        + Add Custom Color
                    </button>
                ) : (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(44, 44, 46, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                    }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <input
                                type="color"
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    value={currentColor}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                            setCurrentColor(value);
                                        }
                                    }}
                                    placeholder="#000000"
                                    maxLength={7}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(28, 28, 30, 0.8)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '6px',
                                        color: 'var(--color-white)',
                                        fontSize: '1rem',
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowCustomPicker(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'var(--color-white)',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={addCustomColor}
                                disabled={colors.includes(currentColor)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: colors.includes(currentColor)
                                        ? 'rgba(212, 175, 55, 0.3)'
                                        : 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'var(--color-charcoal)',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: colors.includes(currentColor) ? 'not-allowed' : 'pointer',
                                    opacity: colors.includes(currentColor) ? 0.5 : 1
                                }}
                            >
                                {colors.includes(currentColor) ? 'Already Added' : 'Add Color'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

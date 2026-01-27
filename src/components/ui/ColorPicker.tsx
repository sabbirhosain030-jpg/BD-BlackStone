'use client';

import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
    label?: string;
    initialColors?: string[];
    onChange: (colors: string[]) => void;
    required?: boolean;
}

export default function ColorPicker({ label = 'Colors', initialColors = [], onChange, required = false }: ColorPickerProps) {
    // using prop directly - fully controlled
    const colors = initialColors;
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
        console.log('🎨 Adding color:', color, 'Current colors:', colors);
        if (!colors.includes(color)) {
            const newColors = [...colors, color];
            // setColors(newColors); // Removed internal state
            onChange(newColors);
            console.log('✅ Color added successfully. New colors:', newColors);
        } else {
            console.log('⚠️ Color already exists in selection');
        }
    };

    const removeColor = (colorToRemove: string) => {
        console.log('🗑️ Removing color:', colorToRemove);
        const newColors = colors.filter(c => c !== colorToRemove);
        // setColors(newColors); // Removed internal state
        onChange(newColors);
        console.log('✅ Color removed. New colors:', newColors);
    };

    const addCustomColor = () => {
        console.log('🎨 Adding custom color:', currentColor);
        if (currentColor && !colors.includes(currentColor)) {
            addColor(currentColor);
            setShowCustomPicker(false);
        } else if (colors.includes(currentColor)) {
            console.log('⚠️ Custom color already exists');
        } else {
            console.log('⚠️ No custom color selected');
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
                marginBottom: '1rem',
                minHeight: '60px'
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeColor(color);
                                    }}
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
                                        transition: 'all 0.2s',
                                        pointerEvents: 'auto'
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
                        No colors selected. Choose from presets below or add a custom one.
                    </p>
                )}
            </div>

            {/* Manual Color Input (Always Visible) */}
            <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: 'rgba(44, 44, 46, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <label style={{ display: 'block', color: 'var(--color-stone-text)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Add Custom Color / Write Manual Hex
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                        <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                                zIndex: 2
                            }}
                        />
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '8px',
                            backgroundColor: currentColor,
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            zIndex: 1
                        }} />
                    </div>

                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            value={currentColor}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCurrentColor(value);
                            }}
                            onBlur={(e) => {
                                // Add # if missing on blur
                                let val = e.target.value;
                                if (val && !val.startsWith('#')) val = '#' + val;
                                if (/^#[0-9A-Fa-f]{3,6}$/.test(val)) setCurrentColor(val);
                            }}
                            placeholder="#000000"
                            className="form-input"
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
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addCustomColor();
                        }}
                        disabled={colors.includes(currentColor)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: colors.includes(currentColor)
                                ? 'rgba(212, 175, 55, 0.3)'
                                : 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'var(--color-charcoal)',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            cursor: colors.includes(currentColor) ? 'not-allowed' : 'pointer',
                            opacity: colors.includes(currentColor) ? 0.5 : 1,
                            pointerEvents: 'auto',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {colors.includes(currentColor) ? 'Added' : 'Add Color'}
                    </button>
                </div>
            </div>

            {/* Quick Presets */}
            <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'var(--color-stone-text)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Quick Select:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: '8px' }}>
                    {presetColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Color button clicked:', color);
                                addColor(color);
                            }}
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
                                opacity: colors.includes(color) ? 0.4 : 1,
                                transition: 'all 0.2s',
                                position: 'relative',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                pointerEvents: 'auto'
                            }}
                            title={color}
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
        </div>
    );
}

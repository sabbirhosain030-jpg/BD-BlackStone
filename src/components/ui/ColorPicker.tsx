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
    const [showPicker, setShowPicker] = useState(false);

    const addColor = () => {
        if (!colors.includes(currentColor)) {
            const newColors = [...colors, currentColor];
            setColors(newColors);
            onChange(newColors);
        }
        setShowPicker(false);
    };

    const removeColor = (colorToRemove: string) => {
        const newColors = colors.filter(c => c !== colorToRemove);
        setColors(newColors);
        onChange(newColors);
    };

    // Convert hex to RGB for display
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `RGB(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
            : '';
    };

    return (
        <div className="color-picker-container">
            <label className="form-label">
                {label} {required && <span style={{ color: 'var(--color-gold)' }}>*</span>}
            </label>

            {/* Color Chips Display */}
            <div className="color-chips">
                {colors.map((color, index) => (
                    <div key={index} className="color-chip" title={`${color} | ${hexToRgb(color)}`}>
                        <div className="color-chip-swatch" style={{ backgroundColor: color }}>
                            {/* Checkered pattern for better visibility of light colors */}
                            <div className="color-chip-pattern"></div>
                        </div>
                        <div className="color-chip-info">
                            <span className="color-chip-hex">{color.toUpperCase()}</span>
                            <span className="color-chip-rgb">{hexToRgb(color)}</span>
                        </div>
                        <button
                            type="button"
                            className="color-chip-remove"
                            onClick={() => removeColor(color)}
                            aria-label="Remove color"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                {/* Add Color Button */}
                <button
                    type="button"
                    className="color-chip-add"
                    onClick={() => setShowPicker(!showPicker)}
                    aria-label="Add color"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Color</span>
                </button>
            </div>

            {/* Color Picker Dialog */}
            {showPicker && (
                <div className="color-picker-dialog">
                    <div className="color-picker-header">
                        <h4>Pick a Color</h4>
                        <button
                            type="button"
                            className="color-picker-close"
                            onClick={() => setShowPicker(false)}
                            aria-label="Close"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="color-picker-content">
                        {/* HTML5 Color Input */}
                        <div className="color-input-wrapper">
                            <input
                                type="color"
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                                className="color-input"
                            />
                            <div className="color-preview" style={{ backgroundColor: currentColor }}>
                                <div className="color-preview-pattern"></div>
                            </div>
                        </div>

                        {/* Hex Input */}
                        <div className="hex-input-group">
                            <label htmlFor="hex-input">Hex Code</label>
                            <input
                                id="hex-input"
                                type="text"
                                value={currentColor}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                        setCurrentColor(value);
                                    }
                                }}
                                className="hex-input"
                                placeholder="#000000"
                                maxLength={7}
                            />
                        </div>

                        {/* RGB Display */}
                        <div className="rgb-display">
                            <span>{hexToRgb(currentColor)}</span>
                        </div>

                        {/* Quick Color Presets */}
                        <div className="color-presets">
                            <span className="presets-label">Quick Select:</span>
                            <div className="preset-colors">
                                {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                                    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            className="preset-color"
                                            style={{ backgroundColor: preset }}
                                            onClick={() => setCurrentColor(preset)}
                                            title={preset}
                                            aria-label={`Select ${preset}`}
                                        >
                                            <div className="preset-pattern"></div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <div className="color-picker-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setShowPicker(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-add"
                            onClick={addColor}
                            disabled={colors.includes(currentColor)}
                        >
                            {colors.includes(currentColor) ? 'Already Added' : 'Add Color'}
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .color-picker-container {
                    margin-bottom: 1.5rem;
                }

                .color-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: rgba(28, 28, 30, 0.4);
                    border: 1px solid var(--color-stone-border);
                    border-radius: 12px;
                    min-height: 80px;
                }

                .color-chip {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 0.75rem 0.5rem 0.5rem;
                    background: rgba(44, 44, 46, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .color-chip:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .color-chip-swatch {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    border-radius: 6px;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    overflow: hidden;
                }

                .color-chip-pattern,
                .color-preview-pattern,
                .preset-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.1) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.1) 75%);
                    background-size: 8px 8px;
                    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
                    opacity: 0.3;
                    z-index: -1;
                }

                .color-chip-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.125rem;
                    min-width: 100px;
                }

                .color-chip-hex {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--color-white);
                    font-family: monospace;
                }

                .color-chip-rgb {
                    font-size: 0.75rem;
                    color: var(--color-stone-text);
                    font-family: monospace;
                }

                .color-chip-remove {
                    width: 24px;
                    height: 24px;
                    border: none;
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .color-chip-remove:hover {
                    background: rgba(239, 68, 68, 0.3);
                    transform: scale(1.1);
                }

                .color-chip-add {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: rgba(212, 175, 55, 0.1);
                    border: 2px dashed rgba(212, 175, 55, 0.3);
                    border-radius: 8px;
                    color: var(--color-gold);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-height: 56px;
                }

                .color-chip-add:hover {
                    background: rgba(212, 175, 55, 0.2);
                    border-color: var(--color-gold);
                    transform: scale(1.02);
                }

                .color-picker-dialog {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 400px;
                    background: linear-gradient(135deg, rgba(44, 44, 46, 0.98), rgba(28, 28, 30, 0.98));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -40%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }

                .color-picker-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .color-picker-header h4 {
                    margin: 0;
                    color: var(--color-white);
                    font-size: 1.125rem;
                }

                .color-picker-close {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--color-white);
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .color-picker-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .color-picker-content {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .color-input-wrapper {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .color-input {
                    width: 80px;
                    height: 80px;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                }

                .color-preview {
                    flex: 1;
                    height: 80px;
                    border-radius: 12px;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    position: relative;
                    overflow: hidden;
                }

                .hex-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .hex-input-group label {
                    color: var(--color-stone-text);
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .hex-input {
                    padding: 0.75rem;
                    background: rgba(28, 28, 30, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: var(--color-white);
                    font-family: monospace;
                    font-size: 1rem;
                    outline: none;
                }

                .hex-input:focus {
                    border-color: var(--color-gold);
                }

                .rgb-display {
                    padding: 0.75rem;
                    background: rgba(28, 28, 30, 0.6);
                    border-radius: 8px;
                    text-align: center;
                    color: var(--color-stone-text);
                    font-family: monospace;
                    font-size: 0.875rem;
                }

                .color-presets {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .presets-label {
                    color: var(--color-stone-text);
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .preset-colors {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 0.5rem;
                }

                .preset-color {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    overflow: hidden;
                }

                .preset-color:hover {
                    transform: scale(1.15);
                    border-color: var(--color-gold);
                    z-index: 10;
                }

                .color-picker-actions {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .btn-cancel,
                .btn-add {
                    flex: 1;
                    padding: 0.875rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-cancel {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--color-white);
                }

                .btn-cancel:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .btn-add {
                    background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
                    color: var(--color-charcoal);
                }

                .btn-add:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
                }

                .btn-add:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .color-picker-dialog {
                        max-width: 90%;
                    }

                    .preset-colors {
                        grid-template-columns: repeat(6, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}

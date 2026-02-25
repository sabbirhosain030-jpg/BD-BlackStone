'use client';

import React, { useState } from 'react';

interface ColorPickerProps {
    colors: string[];
    onChange: (colors: string[]) => void;
}

export default function ColorPicker({ colors, onChange }: ColorPickerProps) {
    const [input, setInput] = useState('');
    const [warning, setWarning] = useState('');

    const handleAdd = () => {
        const color = input.trim();
        if (!color) {
            setWarning('Please enter a color name.');
            setTimeout(() => setWarning(''), 2000);
            return;
        }
        if (colors.includes(color)) {
            setWarning(`"${color}" is already added.`);
            setTimeout(() => setWarning(''), 2000);
            return;
        }
        onChange([...colors, color]);
        setInput('');
        setWarning('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div>
            {/* Added color tags */}
            {colors.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {colors.map((c, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '6px', padding: '5px 10px',
                            fontSize: '13px', color: '#e5e5e5'
                        }}>
                            {c}
                            <button type="button" onClick={() => onChange(colors.filter((_, idx) => idx !== i))}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: 0 }}
                                title="Remove"
                            >×</button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input + Button */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Red, Black, Navy Blue, #FF5733"
                    style={{
                        flex: 1, padding: '9px 14px',
                        background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none'
                    }}
                />
                <button type="button" onClick={handleAdd}
                    style={{
                        background: '#d4af37', color: '#1a1a1a', border: 'none',
                        padding: '9px 20px', borderRadius: '6px',
                        fontWeight: 700, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                >+ Add Color</button>
            </div>

            {warning && <p style={{ color: '#f59e0b', fontSize: '12px', marginTop: '6px' }}>⚠ {warning}</p>}
        </div>
    );
}

'use client';

import { useState } from 'react';

export default function TestPage() {
    const [testResults, setTestResults] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    const testColorPicker = () => {
        addLog('✅ Color Picker Test: Button Clicked!');
        const testColor = '#FF0000';
        setColors([...colors, testColor]);
        addLog(`✅ Color Added: ${testColor}`);
    };

    const testFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        addLog('✅ Form Submit: Started');

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        addLog(`Name: ${formData.get('name')}`);
        addLog(`Price: ${formData.get('price')}`);
        addLog(`Category: ${formData.get('categoryId')}`);
        addLog(`Description: ${formData.get('description')}`);
        addLog(`Images: ${formData.get('imagesJson')}`);

        try {
            addLog('🔄 Calling createProduct action...');
            const response = await fetch('/api/test-product', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                addLog('✅ Form Submit: SUCCESS');
            } else {
                const error = await response.text();
                addLog(`❌ Form Submit: FAILED - ${error}`);
            }
        } catch (error: any) {
            addLog(`❌ Form Submit: ERROR - ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>System Diagnostic Test</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Test Panel */}
                <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Tests</h2>

                    {/* Color Picker Test */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3>1. Color Picker Test</h3>
                        <button
                            type="button"
                            onClick={testColorPicker}
                            style={{
                                padding: '0.75rem 1rem',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Test Add Color
                        </button>
                        <div style={{ marginTop: '0.5rem' }}>
                            Colors: {JSON.stringify(colors)}
                        </div>
                    </div>

                    {/* Form Submit Test */}
                    <div>
                        <h3>2. Form Submit Test</h3>
                        <form onSubmit={testFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input type="text" name="name" placeholder="Product Name" required />
                            <input type="number" name="price" placeholder="Price" required />
                            <input type="text" name="categoryId" placeholder="Category ID" required />
                            <textarea name="description" placeholder="Description" required />
                            <input type="hidden" name="imagesJson" value='["test.jpg"]' />
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Test Submit
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Panel */}
                <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', color: '#0f0' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'white' }}>Console Log</h2>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                        {testResults.length === 0 ? (
                            <div style={{ color: '#888' }}>No tests run yet...</div>
                        ) : (
                            testResults.map((log, i) => (
                                <div key={i} style={{ marginBottom: '4px' }}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        onClick={() => setTestResults([])}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Clear Log
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Click "Test Add Color" - If button works, you'll see log messages</li>
                    <li>Fill form and click "Test Submit" - If form works, you'll see the submitted data</li>
                    <li>Check the log panel for detailed diagnostics</li>
                </ol>
            </div>
        </div>
    );
}

export default function ProductsLoading() {
    return (
        <div style={{ padding: '1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
            {/* Filter bar skeleton */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ width: '120px', height: '38px', background: '#1e1e1e', borderRadius: '8px' }} />
                ))}
            </div>
            {/* Products grid skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', background: '#161616', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ aspectRatio: '3/4', background: '#1e1e1e' }} />
                        <div style={{ padding: '0.75rem' }}>
                            <div style={{ height: '16px', background: '#1e1e1e', borderRadius: '4px', marginBottom: '8px' }} />
                            <div style={{ height: '20px', width: '70px', background: '#1e1e1e', borderRadius: '4px' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminLoading() {
    return (
        <div style={{ padding: '2rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
            {/* Header skeleton */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '180px', height: '32px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px' }} />
                <div style={{ width: '120px', height: '36px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px' }} />
            </div>
            {/* Stats row skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }} />
                ))}
            </div>
            {/* Table skeleton */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                        <div style={{ flex: 1, height: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', alignSelf: 'center' }} />
                        <div style={{ width: '80px', height: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', alignSelf: 'center' }} />
                        <div style={{ width: '60px', height: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', alignSelf: 'center' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

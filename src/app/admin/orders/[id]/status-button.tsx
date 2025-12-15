'use client';

import { updateOrderStatus } from '../../actions';
import { useTransition } from 'react';

export function StatusUpdateButton({ id, status, isCurrent }: { id: string, status: string, isCurrent: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        if (isCurrent) return;
        startTransition(async () => {
            await updateOrderStatus(id, status);
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending || isCurrent}
            style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-stone-border)',
                backgroundColor: isCurrent ? 'var(--color-gold)' : 'var(--color-stone-dark)',
                color: isCurrent ? 'var(--color-charcoal)' : 'var(--color-stone-text)',
                cursor: isCurrent ? 'default' : 'pointer',
                opacity: isPending ? 0.7 : 1,
                transition: 'all 0.2s'
            }}
        >
            {isPending ? '...' : status}
        </button>
    );
}

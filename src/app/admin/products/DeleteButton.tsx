'use client';

import React, { useTransition } from 'react';
import { deleteProduct } from '../actions';

interface DeleteButtonProps {
    productId: string;
}

export default function DeleteButton({ productId }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this product?')) {
            startTransition(async () => {
                const result = await deleteProduct(productId);
                if (!result.success) {
                    alert(result.error);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            style={{
                color: 'var(--color-error)',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                opacity: isPending ? 0.5 : 1
            }}
        >
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    );
}

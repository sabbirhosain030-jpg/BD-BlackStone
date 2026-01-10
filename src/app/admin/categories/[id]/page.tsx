import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CategoryDetailClient from '../CategoryDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CategoryDetailPage({ params }: Props) {
    const { id } = await params;
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            subCategories: true
        }
    });

    if (!category) {
        return <div style={{ color: 'white', padding: '2rem' }}>Category not found</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/categories" style={{ color: 'var(--color-stone-text)', textDecoration: 'none' }}>
                        &larr; Back
                    </Link>
                    <h1 className="admin-title">{category.name}</h1>
                </div>
            </div>

            <CategoryDetailClient
                categoryId={category.id}
                categoryName={category.name}
                subCategories={category.subCategories}
            />
        </div>
    );
}

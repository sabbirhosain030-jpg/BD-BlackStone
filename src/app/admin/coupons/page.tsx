'use client';

import React, { useState, useEffect } from 'react';
import { createCoupon, deleteCoupon, toggleCouponStatus, getAllCoupons, CouponInput } from './actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import '../admin.css'; // Reuse admin styles

type Coupon = {
    id: string;
    code: string;
    discountType: string;
    amount: number;
    isActive: boolean;
    usageLimit: number | null;
    usedCount: number;
    expiresAt: Date | null;
};

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<CouponInput>({
        code: '',
        discountType: 'FIXED',
        amount: 0,
        usageLimit: 0,
        expiresAt: ''
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        const data = await getAllCoupons();
        setCoupons(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createCoupon(formData);
        if (res.success) {
            setIsCreating(false);
            setFormData({ code: '', discountType: 'FIXED', amount: 0, usageLimit: 0, expiresAt: '' });
            loadCoupons();
        } else {
            alert(res.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            await deleteCoupon(id);
            loadCoupons();
        }
    };

    const handleToggle = async (id: string, current: boolean) => {
        await toggleCouponStatus(id, current);
        loadCoupons();
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="admin-title">Manage Coupons</h1>
                <Button onClick={() => setIsCreating(true)} variant="primary">
                    + Create Coupon
                </Button>
            </div>

            {/* Create Modal (simplified inline) */}
            {isCreating && (
                <div style={{
                    background: '#fff', padding: '2rem', borderRadius: '8px',
                    marginBottom: '2rem', border: '1px solid #ddd'
                }}>
                    <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>New Coupon</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                label="Coupon Code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="SUMMER20"
                                required
                            />
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Type</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'FIXED' | 'PERCENTAGE' })}
                                    style={{
                                        width: '100%', padding: '0.75rem', borderRadius: '4px',
                                        border: '1px solid #ddd', fontSize: '1rem'
                                    }}
                                >
                                    <option value="FIXED">Fixed Amount (BDT)</option>
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                </select>
                            </div>
                            <Input
                                label="Discount Amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                required
                            />
                            <Input
                                label="Usage Limit (Optional)"
                                type="number"
                                value={formData.usageLimit || ''}
                                onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                                placeholder="Unlimited"
                            />
                            <Input
                                label="Expires At (Optional)"
                                type="date"
                                value={formData.expiresAt || ''}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <Button type="submit" variant="primary">Save Coupon</Button>
                            <Button type="button" onClick={() => setIsCreating(false)} variant="ghost">Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Status</th>
                            <th>Usage</th>
                            <th>Expires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No coupons found</td></tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon.id}>
                                    <td><strong>{coupon.code}</strong></td>
                                    <td>
                                        {coupon.discountType === 'FIXED' ? `৳ ${coupon.amount}` : `${coupon.amount}% OFF`}
                                    </td>
                                    <td>
                                        <span onClick={() => handleToggle(coupon.id, coupon.isActive)} style={{
                                            cursor: 'pointer',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                            background: coupon.isActive ? '#e8f5e9' : '#ffebee',
                                            color: coupon.isActive ? '#2e7d32' : '#c62828'
                                        }}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}</td>
                                    <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

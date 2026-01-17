'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { getOrderTrends, getTopProducts, getRevenueSummary } from './actions';

export function AnalyticsDashboard() {
    const [trends, setTrends] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [revenue, setRevenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [trendsData, productsData, revenueData] = await Promise.all([
                    getOrderTrends(30),
                    getTopProducts(5),
                    getRevenueSummary()
                ]);

                setTrends(trendsData);
                setTopProducts(productsData);
                setRevenue(revenueData);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-white)' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem' }}>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Revenue Summary Cards */}
            {revenue && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                }}>
                    <div className="stone-card">
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-stone-text)', marginBottom: '0.5rem' }}>
                            Today's Revenue
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-white)' }}>
                            ৳{revenue.today.toLocaleString()}
                        </div>
                    </div>

                    <div className="stone-card">
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-stone-text)', marginBottom: '0.5rem' }}>
                            This Month
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-white)' }}>
                            ৳{revenue.thisMonth.toLocaleString()}
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            color: revenue.monthGrowth >= 0 ? '#5a8f6f' : '#b94a48',
                            marginTop: '0.25rem'
                        }}>
                            {revenue.monthGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenue.monthGrowth)}% vs last month
                        </div>
                    </div>

                    <div className="stone-card">
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-stone-text)', marginBottom: '0.5rem' }}>
                            Total Revenue
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-white)' }}>
                            ৳{revenue.total.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}

            {/* Order Trends Chart */}
            <div className="stone-card">
                <div className="stone-card-title">Order Trends (Last 30 Days)</div>
                <div style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
                    <ResponsiveContainer>
                        <LineChart data={trends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3c" />
                            <XAxis
                                dataKey="date"
                                stroke="#aeaeb2"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <YAxis stroke="#aeaeb2" style={{ fontSize: '0.75rem' }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#2c2c2e',
                                    border: '1px solid #3a3a3c',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#c9a55a"
                                strokeWidth={2}
                                dot={{ fill: '#c9a55a', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products Chart */}
            <div className="stone-card">
                <div className="stone-card-title">Top Selling Products</div>
                <div style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
                    <ResponsiveContainer>
                        <BarChart data={topProducts} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3c" />
                            <XAxis type="number" stroke="#aeaeb2" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={120}
                                stroke="#aeaeb2"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#2c2c2e',
                                    border: '1px solid #3a3a3c',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Bar dataKey="sold" fill="#c9a55a" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

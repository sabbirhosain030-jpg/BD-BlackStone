'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import '../signup/signup.css'; // Reusing styles

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage('Account created successfully! Please log in.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
                setLoading(false);
            } else {
                router.refresh(); // Refresh to update session
                router.push('/'); // Or dashboard
            }
        } catch (error) {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Log in to your account</p>
                </div>

                {successMessage && (
                    <div style={{
                        background: '#e8f5e9',
                        color: '#2e7d32',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        fontSize: '0.875rem'
                    }}>
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        autoFocus
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>Don&apos;t have an account? <Link href="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}

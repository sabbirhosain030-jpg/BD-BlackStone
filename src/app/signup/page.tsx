'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerUser } from './actions';
import './signup.css';

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await registerUser(formData);

        if (result.success) {
            router.push('/login?registered=true');
        } else {
            setError(result.error || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join BD BlackStone for a premium experience</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link href="/login">Log In</Link></p>
                </div>
            </div>
        </div>
    );
}

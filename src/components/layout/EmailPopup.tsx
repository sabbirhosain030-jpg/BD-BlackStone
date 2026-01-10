'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './EmailPopup.css';

export const EmailPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [settings, setSettings] = useState({
        title: 'GET 12% OFF YOUR FIRST ORDER',
        subtitle: 'And be the first to hear about our new product drops!',
        buttonText: 'GET 12% OFF',
        discountPercent: 12
    });


    const pathname = usePathname();

    useEffect(() => {
        // Don't show popup on admin pages
        if (pathname?.startsWith('/admin')) {
            return;
        }

        // Check if user already subscribed in this session
        const hasSubscribed = localStorage.getItem('email_subscribed');
        const hasClosedPopup = sessionStorage.getItem('popup_closed');

        if (!hasSubscribed && !hasClosedPopup) {
            // Fetch popup settings
            fetch('/api/popup-settings')
                .then(res => res.json())
                .then(data => {
                    if (data.isEnabled) {
                        setSettings({
                            title: data.title,
                            subtitle: data.subtitle,
                            buttonText: data.buttonText,
                            discountPercent: data.discountPercent
                        });
                        // Show popup after 3 seconds
                        setTimeout(() => setIsOpen(true), 3000);
                    }
                })
                .catch(err => console.error('Failed to load popup settings:', err));
        }
    }, [pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setCouponCode(data.couponCode);
                localStorage.setItem('email_subscribed', 'true');
                // Don't close immediately, show coupon code
            } else {
                alert(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('popup_closed', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="email-popup-overlay" onClick={handleClose}>
            <div className="email-popup-modal" onClick={(e) => e.stopPropagation()}>
                <button className="email-popup-close" onClick={handleClose}>×</button>

                {!couponCode ? (
                    <>
                        <h2 className="email-popup-title">{settings.title}</h2>
                        <p className="email-popup-subtitle">{settings.subtitle}</p>

                        <form onSubmit={handleSubmit} className="email-popup-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="email-popup-input"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="email-popup-button"
                            >
                                {isLoading ? 'Processing...' : settings.buttonText}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="email-popup-success">
                        <h2 className="email-popup-title">🎉 Success!</h2>
                        <p className="email-popup-subtitle">Your {settings.discountPercent}% OFF coupon code:</p>
                        <div className="coupon-code-display">{couponCode}</div>
                        <p className="email-popup-note">Use this code at checkout to get your discount!</p>
                        <button onClick={handleClose} className="email-popup-button">
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

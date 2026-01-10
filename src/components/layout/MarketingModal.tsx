'use client';

import React, { useState, useEffect } from 'react';
import './MarketingModal.css';

export const MarketingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Check if user has already seen/closed the modal
        const hasSeenModal = localStorage.getItem('seenMarketingModal');
        if (!hasSeenModal) {
            // Show modal after a delay (e.g., 2 seconds)
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('seenMarketingModal', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would call an API/Server Action to subscribe the user
        console.log("Subscribing email:", email);
        handleClose();
        // Ideally show a success toast here
    };

    if (!isOpen) return null;

    return (
        <div className="marketing-modal-overlay">
            <div className="marketing-modal">
                <button className="modal-close" onClick={handleClose}>&times;</button>

                <h2 className="modal-title">
                    Get 12% Off Your<br />First Order
                </h2>

                <p className="modal-description">
                    And be the first to hear about our new product drops!
                </p>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="modal-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="modal-btn">
                        Get 12% Off
                    </button>
                </form>

                <div className="modal-footer">
                    *Valid on orders over 5000 BDT
                </div>
            </div>
        </div>
    );
};

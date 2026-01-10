import React from 'react';
import './policy.css';

export default function PrivacyPage() {
    return (
        <div className="policy-page">
            <div className="container">
                <h1 className="policy-title">Privacy Policy</h1>

                <section className="policy-section">
                    <h2>Information We Collect</h2>
                    <p>We collect information you provide when placing orders, creating an account, or contacting us. This includes:</p>
                    <ul>
                        <li>Name and contact information</li>
                        <li>Shipping and billing address</li>
                        <li>Email address and phone number</li>
                        <li>Order history and preferences</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>How We Use Your Information</h2>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations and shipping updates</li>
                        <li>Respond to your inquiries</li>
                        <li>Improve our products and services</li>
                        <li>Send promotional offers (with your consent)</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Data Protection</h2>
                    <p>We implement appropriate security measures to protect your personal information. Your data is encrypted and stored securely.</p>
                </section>

                <section className="policy-section">
                    <h2>Third-Party Sharing</h2>
                    <p>We do not sell your personal information. We only share data with trusted partners necessary for order fulfillment (shipping carriers, payment processors).</p>
                </section>

                <section className="policy-section">
                    <h2>Contact Us</h2>
                    <p>For privacy concerns, contact us at: <strong>privacy@bdblackstone.com</strong></p>
                </section>
            </div>
        </div>
    );
}

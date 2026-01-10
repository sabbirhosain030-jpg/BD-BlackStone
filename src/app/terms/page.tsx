import React from 'react';
import './policy.css';

export default function TermsPage() {
    return (
        <div className="policy-page">
            <div className="container">
                <h1 className="policy-title">Terms of Service</h1>

                <section className="policy-section">
                    <h2>Acceptance of Terms</h2>
                    <p>By accessing and using BD BlackStone website, you accept and agree to be bound by these Terms of Service.</p>
                </section>

                <section className="policy-section">
                    <h2>Products and Pricing</h2>
                    <ul>
                        <li>All prices are in Bangladeshi Taka (BDT)</li>
                        <li>We reserve the right to modify prices without notice</li>
                        <li>Product images are for illustration purposes</li>
                        <li>Colors may vary slightly from images shown</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Orders</h2>
                    <ul>
                        <li>All orders are subject to availability</li>
                        <li>We reserve the right to refuse or cancel orders</li>
                        <li>Order confirmation does not guarantee acceptance</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>User Accounts</h2>
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                </section>

                <section className="policy-section">
                    <h2>Intellectual Property</h2>
                    <p>All content on this website, including images, text, and logos, is the property of BD BlackStone and protected by copyright laws.</p>
                </section>

                <section className="policy-section">
                    <h2>Contact</h2>
                    <p>For questions about these terms, contact: <strong>legal@bdblackstone.com</strong></p>
                </section>
            </div>
        </div>
    );
}

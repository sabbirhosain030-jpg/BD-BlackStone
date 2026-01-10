import React from 'react';
import './policy.css';

export default function ReturnsPage() {
    return (
        <div className="policy-page">
            <div className="container">
                <h1 className="policy-title">Returns & Exchange</h1>

                <section className="policy-section">
                    <h2>Return Policy</h2>
                    <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, you may return it within 7 days of delivery.</p>
                </section>

                <section className="policy-section">
                    <h2>Eligibility</h2>
                    <ul>
                        <li>Items must be unused and in original packaging</li>
                        <li>Tags must be attached</li>
                        <li>Items should be in resellable condition</li>
                        <li>Undergarments and swimwear are non-returnable</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Exchange Process</h2>
                    <ol>
                        <li>Contact us via email or phone within 7 days</li>
                        <li>Provide your order number and reason for exchange</li>
                        <li>Ship the item back to us</li>
                        <li>We'll send your replacement within 3-5 business days</li>
                    </ol>
                </section>

                <section className="policy-section">
                    <h2>Refunds</h2>
                    <p>Refunds will be processed within 7-10 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.</p>
                </section>

                <section className="policy-section">
                    <h2>Contact Us</h2>
                    <p>For returns and exchanges, please contact:</p>
                    <p><strong>Email:</strong> returns@bdblackstone.com</p>
                    <p><strong>Phone:</strong> +880 1234-567890</p>
                </section>
            </div>
        </div>
    );
}

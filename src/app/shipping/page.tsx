import React from 'react';
import './policy.css';

export default function ShippingPage() {
    return (
        <div className="policy-page">
            <div className="container">
                <h1 className="policy-title">Shipping Policy</h1>

                <section className="policy-section">
                    <h2>Delivery Coverage</h2>
                    <p>We deliver to all districts across Bangladesh. Our shipping partners ensure safe and timely delivery of your orders.</p>
                </section>

                <section className="policy-section">
                    <h2>Shipping Rates</h2>
                    <ul>
                        <li><strong>Inside Dhaka:</strong> ৳60</li>
                        <li><strong>Outside Dhaka:</strong> ৳120</li>
                        <li><strong>Free Shipping:</strong> Orders above ৳5,000</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Delivery Time</h2>
                    <ul>
                        <li><strong>Inside Dhaka:</strong> 1-3 business days</li>
                        <li><strong>Outside Dhaka:</strong> 3-5 business days</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>Order Tracking</h2>
                    <p>Once your order is shipped, you will receive a tracking number via SMS and email to monitor your delivery status.</p>
                </section>

                <section className="policy-section">
                    <h2>Cash on Delivery</h2>
                    <p>We offer Cash on Delivery (COD) for all orders. Pay conveniently when you receive your package.</p>
                </section>
            </div>
        </div>
    );
}

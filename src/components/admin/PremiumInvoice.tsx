'use client';

import React, { useRef } from 'react';

interface InvoiceProps {
    order: any;
}

export default function PremiumInvoice({ order }: InvoiceProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    // Dynamic Branding Logic
    const brands = new Set(order.items.map((item: any) => item.product?.brand || 'BLACK STONE'));
    let brandTitle = "BLACK STONE";
    let watermarkText = "BLACK STONE";

    const hasBlackStone = Array.from(brands).some(b => typeof b === 'string' && b.includes('BLACK STONE'));
    const hasGazzelle = Array.from(brands).some(b => typeof b === 'string' && b.includes('GAZZELLE'));

    if (hasBlackStone && hasGazzelle) {
        brandTitle = "BLACK STONE & GAZZELLE";
        watermarkText = "BLACK STONE & GAZZELLE";
    } else if (hasGazzelle) {
        brandTitle = "GAZZELLE";
        watermarkText = "GAZZELLE";
    }

    const handlePrint = () => {
        const content = invoiceRef.current;
        if (!content) return;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(`
                <html>
                    <head>
                        <title>Invoice - ${order.orderNumber}</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
                            @page { margin: 20mm; }
                            body { 
                                font-family: 'Inter', sans-serif; 
                                margin: 0; 
                                padding: 20px; 
                                color: #000000; 
                                -webkit-print-color-adjust: exact; 
                                print-color-adjust: exact;
                            }
                            .invoice-container { 
                                max-width: 100%; 
                                margin: 0 auto; 
                                border: 3px solid #000000; 
                                padding: 50px; 
                                position: relative; 
                                overflow: hidden;
                                background: white;
                            }
                            .watermark {
                                position: absolute; 
                                top: 50%; 
                                left: 50%; 
                                transform: translate(-50%, -50%) rotate(-45deg);
                                font-size: 100px; 
                                font-weight: 900; 
                                color: rgba(212, 175, 55, 0.05); 
                                white-space: nowrap; 
                                z-index: 0; 
                                pointer-events: none;
                                font-family: 'Playfair Display', serif;
                                letter-spacing: 8px;
                            }
                            .header { 
                                text-align: center; 
                                margin-bottom: 50px; 
                                position: relative; 
                                z-index: 1;
                                border-bottom: 3px solid #d4af37;
                                padding-bottom: 30px;
                            }
                            .brand-title { 
                                font-family: 'Playfair Display', serif; 
                                font-size: 48px; 
                                font-weight: 900; 
                                margin-bottom: 8px; 
                                text-transform: uppercase;
                                color: #000000;
                                letter-spacing: 4px;
                                text-shadow: 3px 3px 0px #d4af37;
                            }
                            .tagline {
                                font-size: 12px;
                                letter-spacing: 3px;
                                text-transform: uppercase;
                                color: #666;
                                margin-bottom: 5px;
                            }
                            .invoice-label {
                                font-size: 32px;
                                font-weight: 700;
                                letter-spacing: 4px;
                                text-transform: uppercase;
                                color: #d4af37;
                                margin-top: 15px;
                                font-family: 'Playfair Display', serif;
                            }
                            .meta-section {
                                display: flex;
                                justify-content: space-between;
                                margin-bottom: 40px;
                                padding: 25px;
                                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
                                border: 2px solid #d4af37;
                                position: relative;
                                z-index: 1;
                            }
                            .meta-column h3 {
                                font-size: 11px;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                color: #666;
                                margin-bottom: 12px;
                                font-weight: 600;
                            }
                            .meta-column p {
                                margin: 6px 0;
                                font-size: 13px;
                                line-height: 1.6;
                            }
                            .meta-column strong {
                                font-weight: 600;
                                color: #000;
                            }
                            .table-container {
                                position: relative;
                                z-index: 1;
                                margin-bottom: 40px;
                            }
                            .table { 
                                width: 100%; 
                                border-collapse: collapse; 
                                margin-bottom: 30px;
                            }
                           .table thead {
                                background: #000000;
                                color: white;
                            }
                            .table th { 
                                text-align: left; 
                                padding: 15px 10px; 
                                text-transform: uppercase; 
                                font-size: 11px; 
                                letter-spacing: 1.5px;
                                font-weight: 700;
                            }
                            .table th:last-child { text-align: right; }
                            .table td { 
                                border-bottom: 1px solid #e5e5e5; 
                                padding: 18px 10px; 
                                font-size: 14px;
                                line-height: 1.6;
                            }
                            .table td:last-child { text-align: right; }
                            .table tbody tr:hover {
                                background: rgba(212, 175, 55, 0.05);
                            }
                            .item-name { 
                                font-weight: 600; 
                                color: #000;
                                margin-bottom: 4px;
                            }
                            .item-variant {
                                font-size: 12px;
                                color: #666;
                                font-style: italic;
                            }
                            .totals-section {
                                display: flex;
                                justify-content: flex-end;
                                margin-top: 30px;
                                position: relative;
                                z-index: 1;
                            }
                            .totals { 
                                width: 350px; 
                                font-size: 14px;
                                border: 2px solid #000;
                                padding: 25px;
                                background: white;
                            }
                            .totals-row { 
                                display: flex; 
                                justify-content: space-between; 
                                padding: 10px 0;
                                border-bottom: 1px solid #e5e5e5;
                            }
                            .totals-row:last-child {
                                border-bottom: none;
                            }
                            .totals-row.discount {
                                color: #d4af37;
                                font-weight: 600;
                            }
                            .grand-total { 
                                border-top: 3px solid #000; 
                                font-weight: 700; 
                                font-size: 20px; 
                                margin-top: 15px; 
                                padding-top: 20px;
                                background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
                                padding: 20px;
                                margin: 15px -25px -25px -25px;
                            }
                            .grand-total .amount {
                                color: #d4af37;
                                font-size: 24px;
                            }
                            .payment-info {
                                margin-top: 40px;
                                padding: 20px;
                                background: #f5f5f5;
                                border-left: 4px solid #d4af37;
                                position: relative;
                                z-index: 1;
                            }
                            .payment-info strong {
                                color: #000;
                            }
                            .footer { 
                                margin-top: 60px; 
                                text-align: center; 
                                font-size: 11px; 
                                color: #999;
                                border-top: 2px solid #e5e5e5; 
                                padding-top: 25px; 
                                position: relative; 
                                z-index: 1;
                            }
                            .footer-highlight {
                                font-weight: 700;
                                color: #000;
                                font-size: 13px;
                                margin-top: 8px;
                                letter-spacing: 1px;
                            }
                            .ai-badge {
                                display: inline-block;
                                margin-top: 10px;
                                padding: 8px 16px;
                                background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
                                color: #000;
                                font-size: 10px;
                                font-weight: 600;
                                letter-spacing: 1px;
                                border-radius: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        ${content.innerHTML}
                    </body>
                </html>
            `);
            doc.close();

            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            };
        }
    };

    return (
        <div style={{ background: 'white', margin: '20px 0' }}>
            {/* Hidden printable content */}
            <div ref={invoiceRef} style={{ display: 'none' }}>
                <div className="invoice-container">
                    {/* Watermark */}
                    <div className="watermark">{watermarkText}</div>

                    <div className="header">
                        <div className="brand-title">{brandTitle}</div>
                        <div className="tagline">Premium Professional Clothing</div>
                        <div className="invoice-label">INVOICE</div>
                    </div>

                    <div className="meta-section">
                        <div className="meta-column">
                            <h3>Invoice Details</h3>
                            <p><strong>Invoice #:</strong> {order.orderNumber}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}</p>
                            <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleTimeString('en-GB')}</p>
                            <p><strong>Status:</strong> <span style={{ color: order.status === 'pending' ? '#d4af37' : '#000' }}>{order.status.toUpperCase()}</span></p>
                        </div>
                        <div className="meta-column" style={{ textAlign: 'right' }}>
                            <h3>Customer Information</h3>
                            <p><strong>{order.customerName}</strong></p>
                            <p>{order.customerPhone}</p>
                            <p>{order.customerEmail}</p>
                            <p>{order.shippingAddress}</p>
                            <p>{order.city}, {order.deliveryZone}</p>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50%' }}>Item Description</th>
                                    <th style={{ width: '15%', textAlign: 'center' }}>Qty</th>
                                    <th style={{ width: '17.5%', textAlign: 'right' }}>Unit Price</th>
                                    <th style={{ width: '17.5%' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any, idx: number) => {
                                    const variant = [item.size, item.color].filter(Boolean).join(' / ');
                                    return (
                                        <tr key={idx}>
                                            <td>
                                                <div className="item-name">{item.product.name}</div>
                                                {variant && <div className="item-variant">{variant}</div>}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                            <td style={{ textAlign: 'right' }}>৳ {item.price.toLocaleString()}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 600 }}>৳ {(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="totals-section">
                        <div className="totals">
                            <div className="totals-row">
                                <span>Subtotal</span>
                                <span><strong>৳ {order.subtotal.toLocaleString()}</strong></span>
                            </div>
                            <div className="totals-row">
                                <span>Shipping ({order.deliveryZone})</span>
                                <span><strong>{order.deliveryCharge === 0 ? 'Free' : `৳ ${order.deliveryCharge.toLocaleString()}`}</strong></span>
                            </div>
                            {order.discount > 0 && (
                                <div className="totals-row discount">
                                    <span>Discount Applied</span>
                                    <span><strong>- ৳ {order.discount.toLocaleString()}</strong></span>
                                </div>
                            )}
                            <div className="totals-row grand-total">
                                <span style={{ fontSize: '16px' }}>TOTAL DUE</span>
                                <span className="amount">৳ {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="payment-info">
                        <p style={{ margin: 0, fontSize: '13px' }}><strong>Payment Method:</strong> {order.paymentMethod || 'Cash on Delivery'}</p>
                    </div>

                    <div className="footer">
                        <p style={{ marginBottom: '5px' }}>Thank you for your business!</p>
                        <p className="footer-highlight">www.bdblackstone.com</p>
                        <p style={{ marginTop: '10px', fontSize: '10px' }}>
                            For inquiries, please contact us via WhatsApp or email
                        </p>
                        <div className="ai-badge">✨ SMART SHOPPING, POWERED BY AI</div>
                    </div>
                </div>
            </div>

            {/* Preview & Print Button */}
            <div style={{ textAlign: 'center', padding: '30px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px', color: '#000', fontFamily: 'Playfair Display, serif' }}>Premium Invoice</h3>
                <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
                    Professional invoice for Order #{order.orderNumber}
                </p>
                <button
                    onClick={handlePrint}
                    style={{
                        background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                        color: '#d4af37',
                        border: '2px solid #d4af37',
                        padding: '14px 32px',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: '4px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = '#d4af37';
                        e.currentTarget.style.color = '#000';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)';
                        e.currentTarget.style.color = '#d4af37';
                    }}
                >
                    🖨️ Print Invoice
                </button>
            </div>
        </div>
    );
}

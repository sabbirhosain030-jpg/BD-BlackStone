'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface ReceiptProps {
    order: any;
    onClose?: () => void;
}

export default function Receipt({ order, onClose }: ReceiptProps) {
    const receiptRef = useRef<HTMLDivElement>(null);

    // Dynamic Branding Logic
    const brands = new Set(order.items.map((item: any) => item.product?.brand || 'BLACK STONE'));
    let brandTitle = "BLACK STONE"; // Default
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
        const content = receiptRef.current;
        if (!content) return;

        // Create a hidden iframe
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
                        <title>Receipt - ${order.orderNumber}</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
                            body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; color: #1a1a1a; -webkit-print-color-adjust: exact; }
                            .receipt-container { 
                                max-width: 100%; margin: 0 auto; 
                                border: 2px solid #1a1a1a; padding: 40px; 
                                position: relative; overflow: hidden;
                            }
                            .watermark {
                                position: absolute; top: 50%; left: 50%; 
                                transform: translate(-50%, -50%) rotate(-45deg);
                                font-size: 80px; font-weight: 900; 
                                color: rgba(0,0,0,0.03); 
                                white-space: nowrap; z-index: 0; pointer-events: none;
                                font-family: 'Playfair Display', serif;
                            }
                            .header { text-align: center; margin-bottom: 40px; position: relative; z-index: 1; }
                            .brand-title { 
                                font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase;
                                color: #1a1a1a;
                                text-shadow: 2px 2px 0px #c9a55a;
                            }
                            .order-meta { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; font-size: 14px; position: relative; z-index: 1; }
                            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; position: relative; z-index: 1; }
                            .table th { text-align: left; border-bottom: 2px solid #1a1a1a; padding: 10px 0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
                            .table td { border-bottom: 1px solid #eee; padding: 15px 0; font-size: 14px; }
                            .totals { margin-left: auto; width: 250px; font-size: 14px; position: relative; z-index: 1; }
                            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
                            .grand-total { border-top: 2px solid #1a1a1a; font-weight: 700; font-size: 18px; margin-top: 10px; padding-top: 15px; }
                            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; position: relative; z-index: 1; }
                        </style>
                    </head>
                    <body>
                        ${content.innerHTML}
                    </body>
                </html>
            `);
            doc.close();

            // Print after images/styles load
            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                // Clean up after print dialog closes (approximate)
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            };
        }
    };

    return (
        <div style={{ padding: '20px', background: 'white', maxWidth: '500px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            {/* Hidden printable content */}
            <div ref={receiptRef} style={{ display: 'none' }}>
                <div className="receipt-container">
                    {/* Watermark */}
                    <div className="watermark">{watermarkText}</div>

                    <div className="header">
                        <div className="brand-title">{brandTitle}</div>
                        <div style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>Official Receipt</div>
                    </div>

                    <div className="order-meta">
                        <div>
                            <div><strong>Order #:</strong> {order.orderNumber}</div>
                            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div><strong>Customer:</strong> {order.customerName}</div>
                            <div><strong>Phone:</strong> {order.customerPhone}</div>
                        </div>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th style={{ textAlign: 'right' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{item.size} / {item.color}</div>
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td style={{ textAlign: 'right' }}>Tk {item.price.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="totals">
                        <div className="totals-row">
                            <span>Subtotal</span>
                            <span>Tk {order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="totals-row">
                            <span>Shipping</span>
                            <span>{order.deliveryCharge === 0 ? 'Free' : `Tk ${order.deliveryCharge}`}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="totals-row" style={{ color: 'green' }}>
                                <span>Discount</span>
                                <span>- Tk {order.discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="totals-row grand-total">
                            <span>Total Due</span>
                            <span>Tk {order.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="footer">
                        <p>Thank you for shopping with us!</p>
                        <p style={{ fontWeight: 600, marginTop: '5px' }}>www.bdblackstone.com</p>
                    </div>
                </div>
            </div>

            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1a1a1a' }}>Receipt Ready</h3>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Download your official receipt for this order.
            </p>
            <Button onClick={handlePrint} fullWidth variant="primary" style={{ height: '48px', fontSize: '1rem' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Receipt
            </Button>
        </div>
    );
}

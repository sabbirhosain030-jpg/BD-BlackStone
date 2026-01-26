import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;

        // Fetch order details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Create PDF
        const doc = new jsPDF();

        // Header
        doc.setFontSize(24);
        doc.setTextColor(26, 26, 26); // Charcoal
        doc.text('BLACKSTONE BD', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text('Premium Clothing & Accessories', 105, 28, { align: 'center' });

        // Horizontal line
        doc.setDrawColor(212, 175, 55); // Gold
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Receipt Title
        doc.setFontSize(16);
        doc.setTextColor(26, 26, 26);
        doc.text('ORDER RECEIPT', 105, 45, { align: 'center' });

        // Order Details
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        let yPos = 60;

        doc.text(`Order Number: ${order.orderNumber}`, 20, yPos);
        yPos += 7;
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 20, yPos);
        yPos += 7;
        doc.text(`Status: ${order.status.toUpperCase()}`, 20, yPos);
        yPos += 15;

        // Customer Information
        doc.setFontSize(12);
        doc.setTextColor(26, 26, 26);
        doc.text('CUSTOMER INFORMATION', 20, yPos);
        doc.setLineWidth(0.3);
        doc.setDrawColor(212, 175, 55);
        doc.line(20, yPos + 2, 80, yPos + 2);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Name: ${order.customerName}`, 20, yPos);
        yPos += 7;
        doc.text(`Email: ${order.customerEmail}`, 20, yPos);
        yPos += 7;
        doc.text(`Phone: ${order.customerPhone}`, 20, yPos);
        yPos += 7;

        // Shipping Address
        doc.text(`Address: ${order.shippingAddress}`, 20, yPos);
        if ((order as any).shippingCity) {
            yPos += 7;
            doc.text(`City: ${(order as any).shippingCity}`, 20, yPos);
        }
        if ((order as any).shippingZip) {
            yPos += 7;
            doc.text(`Postal Code: ${(order as any).shippingZip}`, 20, yPos);
        }
        yPos += 15;

        // Order Items
        doc.setFontSize(12);
        doc.setTextColor(26, 26, 26);
        doc.text('ORDER ITEMS', 20, yPos);
        doc.line(20, yPos + 2, 60, yPos + 2);
        yPos += 10;

        // Table Header
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(212, 175, 55); // Gold background
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.text('ITEM', 22, yPos);
        doc.text('QTY', 140, yPos);
        doc.text('PRICE', 160, yPos);
        doc.text('TOTAL', 180, yPos);
        yPos += 10;

        // Items
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);

        if (order.items && order.items.length > 0) {
            order.items.forEach((item: any) => {
                const itemName = item.product?.name || 'Unknown Product';
                const quantity = item.quantity;
                const price = item.price;
                const total = quantity * price;

                // Wrap long product names
                const maxWidth = 110;
                const lines = doc.splitTextToSize(itemName, maxWidth);

                lines.forEach((line: string, index: number) => {
                    doc.text(line, 22, yPos + (index * 5));
                });

                doc.text(quantity.toString(), 140, yPos);
                doc.text(`৳${price.toLocaleString()}`, 160, yPos);
                doc.text(`৳${total.toLocaleString()}`, 180, yPos);

                yPos += (lines.length * 5) + 3;
            });
        }

        yPos += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        // Totals
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);

        doc.text('Subtotal:', 140, yPos);
        doc.text(`৳${order.total.toLocaleString()}`, 180, yPos, { align: 'right' });
        yPos += 7;

        if ((order as any).shippingCost && (order as any).shippingCost > 0) {
            doc.text('Shipping:', 140, yPos);
            doc.text(`৳${(order as any).shippingCost.toLocaleString()}`, 180, yPos, { align: 'right' });
            yPos += 7;
        }

        if (order.discount && order.discount > 0) {
            doc.setTextColor(212, 44, 44); // Red for discount
            doc.text('Discount:', 140, yPos);
            doc.text(`-৳${order.discount.toLocaleString()}`, 180, yPos, { align: 'right' });
            yPos += 7;
        }

        // Total line
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.line(140, yPos, 190, yPos);
        yPos += 8;

        // Grand Total
        doc.setFontSize(12);
        doc.setTextColor(26, 26, 26);
        doc.setFont('helvetica', 'bold');
        doc.text('GRAND TOTAL:', 140, yPos);
        doc.setTextColor(212, 175, 55); // Gold
        doc.text(`৳${order.total.toLocaleString()}`, 180, yPos, { align: 'right' });

        // Footer
        yPos = 270; // Bottom of page
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for shopping with BlackStone BD!', 105, yPos, { align: 'center' });
        yPos += 5;
        doc.text('For support, contact us at support@bdblackstone.com', 105, yPos, { align: 'center' });

        // Generate PDF buffer
        const pdfBuffer = doc.output('arraybuffer');

        // Return PDF as downloadable file
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="BlackStone-Receipt-${order.orderNumber}.pdf"`,
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Error generating receipt:', error);
        return NextResponse.json(
            { error: 'Failed to generate receipt' },
            { status: 500 }
        );
    }
}

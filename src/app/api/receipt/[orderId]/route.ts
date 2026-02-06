import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        // Fetch order details with optimized query
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true // Only fetch needed fields
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Pre-compute values for better performance
        const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB');
        const totalFormatted = order.total.toLocaleString();

        // Create PDF
        const doc = new jsPDF();

        // Set default font early to avoid repeated switches
        doc.setFont('helvetica', 'normal');

        // Header - Brand Name
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 26, 26); // Charcoal
        doc.text('BLACKSTONE BD', 105, 20, { align: 'center' });

        // Subtitle
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Premium Clothing & Accessories', 105, 28, { align: 'center' });

        // Horizontal line
        doc.setDrawColor(212, 175, 55); // Gold
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Receipt Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 26, 26);
        doc.text('ORDER RECEIPT', 105, 45, { align: 'center' });

        // Order Details Section
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        let yPos = 60;

        doc.text(`Order Number: ${order.orderNumber}`, 20, yPos);
        yPos += 7;
        doc.text(`Date: ${formattedDate}`, 20, yPos);
        yPos += 7;
        doc.text(`Status: ${order.status.toUpperCase()}`, 20, yPos);
        yPos += 15;

        // Customer Information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 26, 26);
        doc.text('CUSTOMER INFORMATION', 20, yPos);
        doc.setLineWidth(0.3);
        doc.setDrawColor(212, 175, 55);
        doc.line(20, yPos + 2, 80, yPos + 2);
        yPos += 10;

        // Customer details - batch font settings
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);

        doc.text(`Name: ${order.customerName}`, 20, yPos);
        yPos += 7;
        doc.text(`Email: ${order.customerEmail}`, 20, yPos);
        yPos += 7;
        doc.text(`Phone: ${order.customerPhone}`, 20, yPos);
        yPos += 7;
        doc.text(`Address: ${order.shippingAddress}`, 20, yPos);

        // Optional fields
        if ((order as any).shippingCity) {
            yPos += 7;
            doc.text(`City: ${(order as any).shippingCity}`, 20, yPos);
        }
        if ((order as any).shippingZip) {
            yPos += 7;
            doc.text(`Postal Code: ${(order as any).shippingZip}`, 20, yPos);
        }
        yPos += 15;

        // Order Items Section
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 26, 26);
        doc.text('ORDER ITEMS', 20, yPos);
        doc.line(20, yPos + 2, 60, yPos + 2);
        yPos += 10;

        // Table Header with gold background
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(212, 175, 55);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.text('ITEM', 22, yPos);
        doc.text('QTY', 140, yPos);
        doc.text('PRICE', 160, yPos);
        doc.text('TOTAL', 180, yPos);
        yPos += 10;

        // Items - optimized rendering
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        if (order.items && order.items.length > 0) {
            // Pre-compute all item data for faster rendering
            const itemsData = order.items.map((item: any) => {
                const itemName = item.product?.name || 'Unknown Product';
                const quantity = item.quantity;
                const price = item.price;
                const total = quantity * price;
                const lines = doc.splitTextToSize(itemName, 110);

                return {
                    lines,
                    quantity: quantity.toString(),
                    price: `৳${price.toLocaleString()}`,
                    total: `৳${total.toLocaleString()}`,
                    lineHeight: lines.length * 5
                };
            });

            // Render all items in one batch
            itemsData.forEach((item) => {
                item.lines.forEach((line: string, index: number) => {
                    doc.text(line, 22, yPos + (index * 5));
                });

                doc.text(item.quantity, 140, yPos);
                doc.text(item.price, 160, yPos);
                doc.text(item.total, 180, yPos);

                yPos += item.lineHeight + 3;
            });
        }

        yPos += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        // Totals Section - batch operations
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);

        doc.text('Subtotal:', 140, yPos);
        doc.text(`৳${totalFormatted}`, 180, yPos, { align: 'right' });
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
            doc.setTextColor(80, 80, 80); // Reset color
            yPos += 7;
        }

        // Total line
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.line(140, yPos, 190, yPos);
        yPos += 8;

        // Grand Total
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 26, 26);
        doc.text('GRAND TOTAL:', 140, yPos);
        doc.setTextColor(212, 175, 55); // Gold
        doc.text(`৳${totalFormatted}`, 180, yPos, { align: 'right' });

        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for shopping with BlackStone BD!', 105, pageHeight - 20, { align: 'center' });
        doc.text('For support, contact us at support@bdblackstone.com', 105, pageHeight - 15, { align: 'center' });

        // Generate PDF buffer efficiently
        const pdfBuffer = doc.output('arraybuffer');

        // Return PDF with proper headers
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="BlackStone-Receipt-${order.orderNumber}.pdf"`,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                'Content-Length': pdfBuffer.byteLength.toString()
            }
        });

    } catch (error) {
        console.error('Error generating receipt:', error);
        return NextResponse.json(
            { error: 'Failed to generate receipt' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

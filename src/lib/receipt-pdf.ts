import jsPDF from 'jspdf';

interface OrderItem {
    product: {
        name: string;
    };
    quantity: number;
    price: number;
    size?: string | null;
    color?: string | null;
}

interface OrderData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    deliveryZone: string;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    paymentMethod: string;
    createdAt: Date;
}

/**
 * Generate professional PDF receipt for orders
 * Optimized for mobile viewing with smaller file size
 */
export function generateReceipt(order: OrderData) {
    const doc = new jsPDF();

    // Add logo image (if available)
    try {
        // Logo dimensions: width 50mm, height auto
        const logoWidth = 50;
        const logoHeight = 12; // Maintain aspect ratio
        const logoX = (doc.internal.pageSize.width - logoWidth) / 2; // Center

        // Note: In production, you'd load the image as base64 or from URL
        // For now, we'll add text-based header
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('BLACK STONE', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium Professional Clothing', 105, 28, { align: 'center' });
    } catch (error) {
        // Fallback to text header if image fails
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('BLACK STONE', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium Professional Clothing', 105, 28, { align: 'center' });
    }

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Receipt Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER RECEIPT', 105, 45, { align: 'center' });

    // Order Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order Number: ${order.orderNumber}`, 20, 55);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 20, 62);
    doc.text(`Time: ${new Date(order.createdAt).toLocaleTimeString('en-GB')}`, 20, 69);

    // Customer Details
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 20, 82);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${order.customerName}`, 20, 89);
    doc.text(`Phone: ${order.customerPhone}`, 20, 96);
    doc.text(`Email: ${order.customerEmail}`, 20, 103);
    doc.text(`Address: ${order.shippingAddress}, ${order.city}`, 20, 110);
    doc.text(`Delivery Zone: ${order.deliveryZone}`, 20, 117);

    // Items Table Header
    doc.setFont('helvetica', 'bold');
    doc.text('ITEMS', 20, 130);
    doc.text('QTY', 130, 130);
    doc.text('PRICE', 155, 130);
    doc.text('TOTAL', 175, 130);

    doc.setLineWidth(0.3);
    doc.line(20, 133, 190, 133);

    // Items
    doc.setFont('helvetica', 'normal');
    let y = 142;
    order.items.forEach((item, index) => {
        const variant = [item.size, item.color].filter(Boolean).join(', ');
        const itemName = variant ? `${item.product.name} (${variant})` : item.product.name;

        // Handle long product names
        const maxWidth = 100;
        const lines = doc.splitTextToSize(itemName, maxWidth);

        doc.text(lines, 20, y);
        doc.text(item.quantity.toString(), 135, y);
        doc.text(`৳${item.price.toLocaleString()}`, 155, y);
        doc.text(`৳${(item.price * item.quantity).toLocaleString()}`, 175, y);

        y += (lines.length * 7) + 3;

        // Page break if needed
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
    });

    // Summary
    y += 10;
    doc.setLineWidth(0.3);
    doc.line(130, y, 190, y);
    y += 8;

    doc.text('Subtotal:', 130, y);
    doc.text(`৳${order.subtotal.toLocaleString()}`, 175, y);
    y += 7;

    doc.text('Delivery:', 130, y);
    doc.text(`৳${order.deliveryCharge.toLocaleString()}`, 175, y);
    y += 7;

    if (order.discount > 0) {
        doc.text('Discount:', 130, y);
        doc.text(`-৳${order.discount.toLocaleString()}`, 175, y);
        y += 7;
    }

    doc.setLineWidth(0.5);
    doc.line(130, y, 190, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', 130, y);
    doc.text(`৳${order.total.toLocaleString()}`, 175, y);

    // Payment Method
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    y += 10;
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, y);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text('Thank you for shopping with BD BlackStone!', 105, pageHeight - 20, { align: 'center' });
    doc.text('For support, contact us via WhatsApp', 105, pageHeight - 15, { align: 'center' });

    // Download
    doc.save(`BD-BlackStone-Receipt-${order.orderNumber}.pdf`);
}

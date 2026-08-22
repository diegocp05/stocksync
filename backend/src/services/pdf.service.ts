import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface OrderData {
  orderNumber: string;
  createdAt: Date;
  supplier: {
    name: string;
    email: string | null;
    cnpj: string | null;
  };
  items: Array<{
    product: {
      name: string;
      sku: string;
    };
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
}

export const generateOrderPDF = (order: OrderData, res: Response) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the PDF into the response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=order_${order.orderNumber}.pdf`);
  doc.pipe(res);

  // Header
  doc
    .fillColor('#2563eb')
    .fontSize(24)
    .text('StockSync', { align: 'left' })
    .fillColor('#1f2937')
    .fontSize(10)
    .text('ORDEM DE FORNECIMENTO', { align: 'right' })
    .moveDown();

  doc
    .strokeColor('#e5e7eb')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown();

  // Order Details
  doc.fontSize(12).font('Helvetica-Bold').text(`Ordem #${order.orderNumber}`);
  doc.fontSize(10).font('Helvetica').text(`Data: ${new Date(order.createdAt).toLocaleDateString('pt-BR')}`);
  doc.moveDown();

  // Supplier Details
  doc.fontSize(12).font('Helvetica-Bold').text('Para o Fornecedor:');
  doc.fontSize(10).font('Helvetica').text(order.supplier.name);
  if (order.supplier.cnpj) doc.text(`CNPJ: ${order.supplier.cnpj}`);
  if (order.supplier.email) doc.text(`Email: ${order.supplier.email}`);
  doc.moveDown(2);

  // Table Header
  const tableTop = doc.y;
  doc.font('Helvetica-Bold');
  doc.text('SKU', 50, tableTop);
  doc.text('Produto', 150, tableTop);
  doc.text('Qtd', 380, tableTop);
  doc.text('Preço Un.', 430, tableTop);
  doc.text('Subtotal', 500, tableTop);

  doc
    .strokeColor('#e5e7eb')
    .lineWidth(1)
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  let position = tableTop + 25;
  doc.font('Helvetica');

  // Items
  order.items.forEach(item => {
    const subtotal = item.quantity * item.unitPrice;
    
    doc.text(item.product.sku, 50, position);
    doc.text(item.product.name, 150, position, { width: 220 });
    doc.text(item.quantity.toString(), 380, position);
    doc.text(`R$ ${item.unitPrice.toFixed(2)}`, 430, position);
    doc.text(`R$ ${subtotal.toFixed(2)}`, 500, position);
    
    position += 20;
  });

  // Total
  doc
    .strokeColor('#e5e7eb')
    .lineWidth(1)
    .moveTo(50, position + 10)
    .lineTo(550, position + 10)
    .stroke();

  doc.font('Helvetica-Bold').fontSize(12).text('TOTAL DA ORDEM:', 380, position + 25);
  doc.fillColor('#2563eb').text(`R$ ${order.totalAmount.toFixed(2)}`, 500, position + 25);

  // Footer
  doc
    .fillColor('#9ca3af')
    .fontSize(8)
    .text('Gerado automaticamente pelo sistema StockSync.', 50, 700, { align: 'center', width: 500 });

  doc.end();
};

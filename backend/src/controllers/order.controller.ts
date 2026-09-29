import { Request, Response } from 'express';
import prisma from '../prisma';
import { generateOrderPDF } from '../services/pdf.service';
import { OrderService } from '../services/order.service';

export const generateOrdersFromLowStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderService = new OrderService(prisma);
    const result = await orderService.generateOrdersFromLowStock();
    res.json(result);
  } catch (error) {
    console.error('Error generating orders:', error);
    res.status(500).json({ error: 'Erro ao gerar ordens de fornecimento.' });
  }
};

export const listOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.supplyOrder.findMany({
      include: {
        supplier: { select: { name: true, cnpj: true, email: true } },
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error listing orders:', error);
    res.status(500).json({ error: 'Erro ao listar ordens de fornecimento.' });
  }
};

export const downloadOrderPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await prisma.supplyOrder.findUnique({
      where: { id },
      include: {
        supplier: { select: { name: true, email: true, cnpj: true } },
        items: {
          include: { product: { select: { name: true, sku: true } } }
        }
      }
    });

    if (!order) {
      res.status(404).json({ error: 'Ordem não encontrada.' });
      return;
    }

    generateOrderPDF(order, res);
  } catch (error) {
    console.error('Error downloading order PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF da ordem de fornecimento.' });
  }
};

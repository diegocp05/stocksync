import { Request, Response } from 'express';
import prisma from '../prisma';
import { generateOrderPDF } from '../services/pdf.service';

export const generateOrdersFromLowStock = async (req: Request, res: Response): Promise<void> => {
  try {
    // Buscar produtos com baixo estoque que ainda não estão em uma ordem pendente
    const lowStockProducts = await prisma.product.findMany({
      where: {
        currentStock: { lt: prisma.product.fields.minStock },
        // Não gerar novas ordens se já tiver ordens pendentes
        orderItems: { none: { supplyOrder: { status: 'PENDING' } } }
      },
      include: { supplier: true }
    });

    if (lowStockProducts.length === 0) {
      res.json({ message: 'Nenhum produto abaixo do estoque mínimo precisa de reposição no momento.', ordersGenerated: 0 });
      return;
    }

    // Agrupar produtos por fornecedor
    const productsBySupplier = lowStockProducts.reduce((acc, product) => {
      if (!acc[product.supplierId]) {
        acc[product.supplierId] = [];
      }
      acc[product.supplierId].push(product);
      return acc;
    }, {} as Record<string, typeof lowStockProducts>);

    let generatedCount = 0;

    // Criar ordens para cada fornecedor
    for (const supplierId in productsBySupplier) {
      const products = productsBySupplier[supplierId];
      
      let totalAmount = 0;
      const orderItemsData = products.map(product => {
        const orderQuantity = product.minStock * 2; // Regra de negócio: pedir o dobro do mínimo para estocar
        const unitPrice = product.unitPrice;
        totalAmount += orderQuantity * unitPrice;

        return {
          productId: product.id,
          quantity: orderQuantity,
          unitPrice
        };
      });

      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      await prisma.supplyOrder.create({
        data: {
          orderNumber,
          supplierId,
          totalAmount,
          items: {
            create: orderItemsData
          }
        }
      });

      generatedCount++;
    }

    res.json({ message: `${generatedCount} ordem(s) gerada(s) com sucesso.`, ordersGenerated: generatedCount });
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

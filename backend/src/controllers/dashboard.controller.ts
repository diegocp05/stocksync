import { Request, Response } from 'express';
import prisma from '../prisma';

export const getMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalProducts = await prisma.product.count();
    
    // Contar apenas os produtos onde currentStock < minStock
    // Para simplificar no SQLite ou PostgreSQL nativamente, fazemos um fetch e filtramos (ou usando Prisma Where)
    // No prisma podemos fazer currentStock: { lt: prisma.product.fields.minStock } 
    // mas isso só funciona no Prisma v5.0+ com preview features. Para garantir compatibilidade:
    
    // Uma query simples para contar produtos abaixo do mínimo
    const allProducts = await prisma.product.findMany({ select: { currentStock: true, minStock: true } });
    const lowStockCount = allProducts.filter(p => p.currentStock < p.minStock).length;

    const totalSuppliers = await prisma.supplier.count();
    const totalOrders = await prisma.supplyOrder.count();

    // Calcular o total de patrimônio em estoque (currentStock * unitPrice)
    const productsForValuation = await prisma.product.findMany({ select: { currentStock: true, unitPrice: true } });
    const totalStockValue = productsForValuation.reduce((acc, p) => acc + (p.currentStock * p.unitPrice), 0);

    // Gráfico 1: Produtos por Fornecedor (Top 5)
    const suppliers = await prisma.supplier.findMany({
      include: { _count: { select: { products: true } } },
      take: 5,
      orderBy: { products: { _count: 'desc' } }
    });
    
    const chartProductsBySupplier = suppliers.map(s => ({
      name: s.name.split(' ')[0], // Primeiro nome para caber no gráfico
      quantidade: s._count.products
    }));

    // Gráfico 2: Evolução de Gastos com Ordens (Últimas ordens)
    const recentOrders = await prisma.supplyOrder.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true, totalAmount: true }
    });

    const chartOrdersValue = recentOrders.reverse().map(o => ({
      ordem: o.orderNumber.split('-')[1] || o.orderNumber, // Pegar meio da string p gráfico
      valor: o.totalAmount
    }));

    res.json({
      cards: {
        totalProducts,
        lowStockCount,
        totalSuppliers,
        totalOrders,
        totalStockValue
      },
      charts: {
        productsBySupplier: chartProductsBySupplier,
        ordersValue: chartOrdersValue
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Erro ao carregar métricas do dashboard.' });
  }
};

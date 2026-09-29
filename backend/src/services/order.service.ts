import { PrismaClient } from '../generated/prisma/client';

export class OrderService {
  constructor(private prisma: PrismaClient) {}

  async generateOrdersFromLowStock(): Promise<{ ordersGenerated: number; message: string }> {
    // Buscar produtos com baixo estoque que ainda não estão em uma ordem pendente
    const lowStockProducts = await this.prisma.product.findMany({
      where: {
        currentStock: { lt: this.prisma.product.fields.minStock },
        // Não gerar novas ordens se já tiver ordens pendentes
        orderItems: { none: { supplyOrder: { status: 'PENDING' } } }
      },
      include: { supplier: true }
    });

    if (lowStockProducts.length === 0) {
      return { 
        message: 'Nenhum produto abaixo do estoque mínimo precisa de reposição no momento.', 
        ordersGenerated: 0 
      };
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

      await this.prisma.supplyOrder.create({
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

    return { 
      message: `${generatedCount} ordem(s) gerada(s) com sucesso.`, 
      ordersGenerated: generatedCount 
    };
  }
}

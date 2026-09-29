import { describe, it, expect, beforeEach } from 'vitest';
import { OrderService } from './order.service';
import { PrismaClient } from '../generated/prisma/client';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';

describe('OrderService - Gestão B2B', () => {
  let prismaMock: DeepMockProxy<PrismaClient>;
  let orderService: OrderService;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    orderService = new OrderService(prismaMock as unknown as PrismaClient);
  });

  it('deve retornar 0 ordens geradas se não houver produtos com estoque baixo', async () => {
    // Cenário: O banco retorna array vazio para produtos com baixo estoque
    prismaMock.product.findMany.mockResolvedValue([]);

    const result = await orderService.generateOrdersFromLowStock();

    expect(result.ordersGenerated).toBe(0);
    expect(result.message).toContain('Nenhum produto abaixo do estoque');
    
    // Garante que nenhuma ordem de compra foi criada
    expect(prismaMock.supplyOrder.create).not.toHaveBeenCalled();
  });

  it('deve agrupar produtos por fornecedor e calcular o dobro do estoque mínimo (Regra de Negócio)', async () => {
    // Cenário: 2 produtos do mesmo fornecedor que precisam de reposição
    const mockProducts = [
      {
        id: 'prod-1',
        minStock: 10, // Deve pedir 20
        unitPrice: 50, // Total = 1000
        supplierId: 'sup-1',
      },
      {
        id: 'prod-2',
        minStock: 5, // Deve pedir 10
        unitPrice: 20, // Total = 200
        supplierId: 'sup-1',
      }
    ] as any;

    prismaMock.product.findMany.mockResolvedValue(mockProducts);
    
    // Quando o serviço for chamado
    const result = await orderService.generateOrdersFromLowStock();

    // Verificações
    expect(result.ordersGenerated).toBe(1); // Apenas 1 fornecedor, logo 1 ordem
    expect(prismaMock.supplyOrder.create).toHaveBeenCalledTimes(1);

    // Valida os dados passados na criação da ordem (cálculo de preço e quantidade)
    const createArgs = prismaMock.supplyOrder.create.mock.calls[0][0];
    expect(createArgs.data.supplierId).toBe('sup-1');
    expect(createArgs.data.totalAmount).toBe(1200); // 1000 + 200
    
    // Verifica se os itens da ordem respeitam a regra de "dobro do mínimo"
    expect(createArgs.data.items?.create).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ productId: 'prod-1', quantity: 20 }),
        expect.objectContaining({ productId: 'prod-2', quantity: 10 }),
      ])
    );
  });
});

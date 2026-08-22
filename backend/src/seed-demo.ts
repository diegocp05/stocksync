import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const supplier = await prisma.supplier.create({
    data: {
      name: 'Indústrias Acme S.A',
      cnpj: '12.345.678/0001-90',
      email: 'vendas@acme.com',
    }
  });

  await prisma.product.create({
    data: {
      sku: 'PRD-999',
      name: 'Rolamento de Aço Carbono',
      currentStock: 2, 
      minStock: 15,
      unitPrice: 45.50,
      supplierId: supplier.id
    }
  });

  console.log('Seed demo criado!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

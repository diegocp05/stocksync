import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';

const productSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(2),
  category: z.string().optional().nullable(),
  currentStock: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(10),
  unitPrice: z.number().min(0).default(0.0),
  supplierId: z.string().uuid(),
});

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: { supplier: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
};

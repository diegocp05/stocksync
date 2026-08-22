import 'dotenv/config';
import prisma from './prisma';

console.log("Prisma keys:", Object.keys(prisma).filter(k => !k.startsWith('_')));
console.log("SupplyOrder exists:", !!prisma.supplyOrder);

import { PrismaClient } from '../app/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Initialize Prisma Client with PostgreSQL adapter
const accelerateUrl = process.env.DATABASE_URL!;

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
};

export const prisma = 
    globalForPrisma.prisma || 
    new PrismaClient({accelerateUrl}).$extends(withAccelerate());

// Prevent multiple instances of Prisma Client in development   

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
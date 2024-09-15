import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (productData: any) => {
  return prisma.product.create({
    data: productData,
  });
};

export const getProducts = async () => {
  return prisma.product.findMany();
};

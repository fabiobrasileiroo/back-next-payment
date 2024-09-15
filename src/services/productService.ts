import { type Prisma, PrismaClient } from '@prisma/client'
import type { Product } from '../@types/productTypes'

const prisma = new PrismaClient()

export const createProduct = async (productData: Prisma.ProductCreateInput) => {
  return prisma.product.create({
    data: productData,
  })
}
export const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      company: true,
    },
  })
}

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      company: true,
    },
  })
}

export const updateProduct = async (
  id: number,
  productData: Partial<Product>
) => {
  return prisma.product.update({
    where: { id },
    data: productData,
  })
}

export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: { id },
  })
}

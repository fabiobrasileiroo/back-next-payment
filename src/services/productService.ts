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

export const increaseProductQuantity = async (productId: number, quantityToIncrease: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  // Atualiza o produto com a nova quantidade
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: product.quantity + quantityToIncrease
    }
  })

  return updatedProduct
}

export const decreaseProductQuantity = async (productId: number, quantityToDecrease: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  // Verifica se a quantidade atual é suficiente para decrementar
  if (product.quantity < quantityToDecrease) {
    throw new Error('Quantidade insuficiente no estoque')
  }

  // Atualiza o produto com a nova quantidade
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: product.quantity - quantityToDecrease
    }
  })

  return updatedProduct
}

export const decreaseProductQuantityWithCheck = async (productId: number, quantityToDecrease: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  if (product.quantity < quantityToDecrease) {
    throw new Error('Quantidade insuficiente no estoque')
  }

  const newQuantity = product.quantity - quantityToDecrease

  // Atualiza o produto e, se a quantidade chegar a 0, você pode marcar como indisponível
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: newQuantity,
      // Exemplo de como marcar o produto como indisponível se a quantidade chegar a 0
      ...(newQuantity === 0 && { status: 'Indisponível' }) 
    }
  })

  return updatedProduct
}

export const checkProductStock = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  return {
    name: product.name,
    quantity: product.quantity,
    status: product.quantity > 0 ? 'Disponível' : 'Indisponível'
  }
}

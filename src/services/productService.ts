import { PrismaClient, Prisma } from '@prisma/client'
import { Product } from '../@types/productTypes'

const prisma = new PrismaClient()

// Função para criar ou obter uma categoria existente
export const createOrUpdateCategory = async (name: string) => {
  let category = await prisma.category.findUnique({
    where: { name },
  })

  if (!category) {
    category = await prisma.category.create({
      data: { name },
    })
  }

  return category
}



// Função para criar um produto com o ID da empresa e a categoria associados
export const createProduct = async (productData: Prisma.ProductCreateInput, companyId: number, categoryId?: number) => {
  return prisma.product.create({
    data: {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      imageUrl: productData.imageUrl,
      quantity: productData.quantity,
      company: {
        connect: { id: companyId },
      },
      ...(categoryId && {
        category: {
          connect: { id: categoryId },
        },
      }),
    },
    include: {
      company: true,
      category: true,
    },
  })
}
export const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      company: true,
      category: true,
    },
  })
}

// Função para buscar produtos por categoria
export const getProductsByCategory = async (categoryId: number) => {
  return prisma.product.findMany({
    where: {
      categoryId: categoryId,
    },
    include: {
      company: true,
      category: true,
    },
  })
}


export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      company: true,
      category: true,
    },
  })
}

export const updateProduct = async (
  id: number,
  productData: Partial<Product>
) => {
  // Configuração para conectar a categoria, se fornecida
  let categoryConnect = undefined
  if (productData.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    })

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    categoryConnect = { connect: { id: category.id } }
  }

  // Configuração para conectar a empresa, se fornecida
  let companyConnect = undefined
  if (productData.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: productData.companyId },
    })

    if (!company) {
      throw new Error('Empresa não encontrada')
    }

    companyConnect = { connect: { id: company.id } }
  }

  // Atualiza o produto com a empresa e a categoria associadas, se fornecidas
  return prisma.product.update({
    where: { id },
    data: {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      imageUrl: productData.imageUrl,
      quantity: productData.quantity,
      category: categoryConnect, // Conecta a categoria, se fornecida
      company: companyConnect,   // Conecta a empresa, se fornecida
    },
    include: { category: true, company: true }, // Inclui a categoria e a empresa nos resultados
  })
}


export const deleteProduct = async (id: number) => {
  // Verifica se o produto existe
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  // Deleta o produto se ele existir
  return prisma.product.delete({
    where: { id },
  })
}

export const deleteProducts = async (ids: number[]) => {
  // Verifica se os produtos existem
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  if (products.length !== ids.length) {
    throw new Error('Um ou mais produtos não foram encontrados');
  }

  // Deleta os produtos
  return prisma.product.deleteMany({
    where: { id: { in: ids } },
  });
};



export const increaseProductQuantity = async (
  productId: number,
  quantityToIncrease: number
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: product.quantity + quantityToIncrease,
    },
  })

  return updatedProduct
}

export const decreaseProductQuantity = async (
  productId: number,
  quantityToDecrease: number
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  if (product.quantity < quantityToDecrease) {
    throw new Error('Quantidade insuficiente no estoque')
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: product.quantity - quantityToDecrease,
    },
  })

  return updatedProduct
}

export const checkProductStock = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error('Produto não encontrado')
  }

  return {
    name: product.name,
    quantity: product.quantity,
    status: product.quantity > 0 ? 'Disponível' : 'Indisponível',
  }
}

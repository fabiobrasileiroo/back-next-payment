import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Novo controlador para listar todas as empresas e seus produtos
export const getAllCompaniesWithProducts = async () => {
  return prisma.company.findMany({
    include: {
      products: true, // Inclui os produtos associados a cada empresa
    },
  })
}

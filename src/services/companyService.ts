import { type Prisma, PrismaClient } from '@prisma/client'
import { companyType } from '@/@types/companyTypes'

const prisma = new PrismaClient()

export const createCompany = async (companyData: Prisma.CompanyCreateInput) => {
  return prisma.company.create({
    data: {
      name: companyData.name,
      document: companyData.document,
    },
  })
}

export const getCompany = async () => {
  return prisma.company.findMany()
}

export const getCompanyById = async (id: number) => {
  return prisma.company.findUnique({
    where: { id },
  })
}

export const updateCompany = async (
  id: number,
  companyData: Partial<companyType>
) => {
  return prisma.product.update({
    where: { id },
    data: companyData,
  })
}

export const deleteCompany = async (id: number) => {
  return prisma.company.delete({
    where: { id },
  })
}

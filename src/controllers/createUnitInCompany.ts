import { PrismaClient } from '@prisma/client'
import type { Request, Response } from 'express'

const prisma = new PrismaClient()

export const createUnitInCompany = async (req: Request, res: Response) => {
  const { name } = req.body

  // Verificar se o usuário está autenticado
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  const adminUserId = req.user.id // Pega o ID do usuário autenticado

  try {
    // Verificar se o usuário autenticado é realmente um ADMIN
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      include: { company: true }, // Incluir a empresa relacionada
    })

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Only administrators can create units.' })
    }

    // Verifica se o adminUser tem uma empresa associada
    if (!adminUser.companyId) {
      return res
        .status(400)
        .json({ message: 'Admin user does not have a company associated.' })
    }

    // Criar a nova unidade e associá-la à empresa do administrador
    const newUnit = await prisma.unit.create({
      data: {
        name,
        company: { connect: { id: adminUser.companyId } }, // Associa a unidade à empresa do administrador
      },
    })

    res.status(201).json({
      message: 'Unit created successfully',
      unit: newUnit,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

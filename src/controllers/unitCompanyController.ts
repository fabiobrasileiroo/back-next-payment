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

export const getUnitsInCompany = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const adminUserId = req.user.id;

  try {
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      include: { company: true },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Only administrators can view units.' });
    }

    const units = await prisma.unit.findMany({
      where: { companyId: adminUser.companyId ?? undefined},
      select: {
        id: true,
        name: true,
        pixKey: true,
      },
    });

    res.status(200).json({ units });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUnitById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const adminUserId = req.user.id;

  try {
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      include: { company: true },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Only administrators can view units.' });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!unit || unit.companyId !== adminUser.companyId) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.status(200).json({ unit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, pixKey } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const adminUserId = req.user.id;

  try {
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      include: { company: true },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Only administrators can update units.' });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: parseInt(id) },
    });

    if (!unit || unit.companyId !== adminUser.companyId) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const updatedUnit = await prisma.unit.update({
      where: { id: parseInt(id) },
      data: {
        name,
        pixKey,
      },
    });

    res.status(200).json({
      message: 'Unit updated successfully',
      unit: updatedUnit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const adminUserId = req.user.id;

  try {
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      include: { company: true },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Only administrators can delete units.' });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: parseInt(id) },
    });

    if (!unit || unit.companyId !== adminUser.companyId) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    await prisma.unit.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

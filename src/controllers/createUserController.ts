import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'

const prisma = new PrismaClient()
const saltRounds = 10

export const createUserInCompany = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body

  // Verifica se req.user existe antes de tentar acessá-lo
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  const adminUserId = req.user.id // Pega o ID do usuário autenticado (administrador)

  try {
    // Verificar se o usuário autenticado é realmente um ADMIN
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      include: { company: true }, // Incluir a empresa relacionada
    })

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Only administrators can create users.' })
    }

    // Verifica se o adminUser tem uma empresa associada
    if (!adminUser.companyId) {
      return res
        .status(400)
        .json({ message: 'Admin user does not have a company associated.' })
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Criar o novo usuário e associá-lo à mesma empresa do administrador
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER', // Por padrão, novos usuários são do tipo 'USER'
        company: { connect: { id: adminUser.companyId } }, // Associa o novo usuário à empresa do admin
      },
    })

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

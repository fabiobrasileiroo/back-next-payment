import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const saltRounds = 10

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Criar um novo usuário
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role, // Supondo que role é uma propriedade opcional
      },
    })

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    // Encontrar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const horaParaDias: string = `${24 * 356}h`
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: horaParaDias } // 8544h == 356 dias
    )

    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

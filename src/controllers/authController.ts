import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import * as companyService from '../services/companyService'

const prisma = new PrismaClient()
const saltRounds = 10

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role, companyName, companyDocument } = req.body

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Verificar se a empresa já existe
    const existingCompany = await prisma.company.findUnique({
      where: { name: companyName, document: companyDocument },
    })

    let companyId: number

    if (!existingCompany) {
      // Criar a empresa
      const newCompany = await companyService.createCompany({
        name: companyName,
        document: companyDocument,  // Documento da empresa (CNPJ ou outro)
      })

      companyId = newCompany.id
    } else {
      companyId = existingCompany.id
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Criar um novo usuário e associá-lo à empresa
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'ADMIN', // O primeiro usuário será ADMIN
        company: { connect: { id: companyId } }, // Associa o usuário à empresa
      },
    })

    // Gerar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    )

    res.status(201).json({
      message: 'User and company created successfully',
      user: newUser,
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    )

    // Retornar o token e as informações do usuário
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
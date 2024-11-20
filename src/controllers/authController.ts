import 'dotenv/config'

import { PrismaClient, UserRole } from '@prisma/client' // Importação do enum UserRole
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import * as companyService from '../services/companyService'
import { DEFAULT_IMAGE_URL } from '@/assets/noImage'
import axios from 'axios'

const prisma = new PrismaClient()
const saltRounds = 10

// Função de registro de usuário com proposta

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    name,
    companyName,
    companyDocument,
    proposalValue,
    unitName,
    imageUrl, // Adicionado para receber a imagem em base64
  } = req.body
  console.log('🚀 ~ register ~ imageUrl:', imageUrl)

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
      where: { document: companyDocument },
    })

    let companyId: number

    if (!existingCompany) {
      // Criar a empresa se não existir
      const newCompany = await companyService.createCompany({
        name: companyName,
        document: companyDocument,
      })
      companyId = newCompany.id
    } else {
      companyId = existingCompany.id
    }

    // Verificar ou criar a unidade da empresa
    let unit = await prisma.unit.findFirst({
      where: {
        name: unitName,
        companyId: companyId,
      },
    })

    if (!unit) {
      // Criar unidade se não existir
      unit = await prisma.unit.create({
        data: {
          name: unitName,
          company: { connect: { id: companyId } },
        },
      })
    }

    console.log('chego no 73')
    // Processar o upload da imagem, se fornecida
    let uploadedImageUrl = DEFAULT_IMAGE_URL
    if (imageUrl) {
      try {
        console.log('chego no 78')
        const base64Image = imageUrl.replace(/^data:image\/\w+;base64,/, '')
        const response = await axios.post(
          'https://api.imgbb.com/1/upload',
          {
            key: process.env.IMGBB_API_KEY,
            image: base64Image,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        console.log('dentro imgBB')
        uploadedImageUrl = response.data.data.url
      } catch (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError)
      }
    }
    console.log('chego no 97')

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Criar o usuário associado à proposta
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.PENDING, // Use o enum UserRole corretamente
        companyId: companyId, // Associar o usuário à empresa
        imageUrl: uploadedImageUrl, // Salvar a URL da imagem
      },
    })

    // Criar a proposta de usuário
    const newProposal = await prisma.proposal.create({
      data: {
        companyName: companyName,
        companyDocument: companyDocument,
        proposalValue: proposalValue, // Valor da proposta
        unitId: unit.id, // Associar a unidade à proposta
        userId: newUser.id, // Associar a proposta ao usuário criado
      },
    })

    res.status(201).json({
      message: 'User and proposal created, pending approval',
      user: newUser,
      proposal: newProposal,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Função de login de usuário

// Function to generate menu items based on user role with the same structure as the provided example
const getMenuForRole = (role: any) => {
  const menu = [
    {
      group: 'Loja',
      separator: false,
      items: [
        {
          icon: 'assets/icons/products.svg',
          label: 'Products',
          route: '/products',
          children: [
            { label: 'View Products', route: '/products/view' },
            // { label: 'Categories', route: '/products/categories' },
            // Admin-only routes
            ...(role === UserRole.ADMIN
              ? [
                  {
                    label: 'Gerenciamento de produtos',
                    route: '/products/add',
                    adminOnly: true,
                  },
                  {
                    label: 'Pagamentos',
                    route: '/products/transactions',
                    adminOnly: true,
                  },
                  // {
                  //   label: 'Detalhes de Product',
                  //   route: '/products/transactions',
                  //   adminOnly: true,
                  // },
                ]
              : []),
          ],
        },
      ],
    },
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            // { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            // { label: 'New Password', route: '/auth/new-password' },
            // Additional auth routes can be added here if needed
          ],
        },
      ],
    },
    {
      group: 'Collaboration',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Users',
          route: '/users',
        },
      ],
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        },
      ],
    },
  ]

  return menu
}

// User login function with the updated menu format
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify if the user's proposal is approved
    const proposal = await prisma.proposal.findUnique({
      where: { userId: user.id },
    })

    if (!proposal || proposal.status !== 'APPROVED') {
      return res.status(403).json({ message: 'Proposal is not approved' })
    }

    // Verify if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    )

    // Get the menu for the user's role
    const menu = getMenuForRole(user.role)

    // Return the token, user information, and menu
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        companyId: user.companyId,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role,
      },
      menu, // Include the menu in the response
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

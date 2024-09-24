import { PrismaClient, UserRole } from '@prisma/client' // Importação do enum UserRole
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import * as companyService from '../services/companyService'

const prisma = new PrismaClient()
const saltRounds = 10

// Função de registro de usuário com proposta
export const register = async (req: Request, res: Response) => {
  const { email, password, name, companyName, companyDocument, proposalValue, unitName } = req.body;

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Verificar se a empresa já existe
    const existingCompany = await prisma.company.findUnique({
      where: { document: companyDocument },
    });

    let companyId: number;

    if (!existingCompany) {
      // Criar a empresa se não existir
      const newCompany = await companyService.createCompany({
        name: companyName,
        document: companyDocument,
      });
      companyId = newCompany.id;
    } else {
      companyId = existingCompany.id;
    }

    // Verificar ou criar a unidade da empresa
    let unit = await prisma.unit.findFirst({
      where: {
        name: unitName,
        companyId: companyId
      },
    });

    if (!unit) {
      // Criar unidade se não existir
      unit = await prisma.unit.create({
        data: {
          name: unitName,
          company: { connect: { id: companyId } }
        }
      });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar o usuário associado à proposta
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.PENDING,  // Use o enum UserRole corretamente
        companyId: companyId,    // Associar o usuário à empresa
      }
    });

    // Criar a proposta de usuário
    const newProposal = await prisma.proposal.create({
      data: {
        companyName: companyName,
        companyDocument: companyDocument,
        proposalValue: proposalValue,  // Valor da proposta
        unitId: unit.id,  // Associar a unidade à proposta
        userId: newUser.id  // Associar a proposta ao usuário criado
      },
    });

    res.status(201).json({
      message: 'User and proposal created, pending approval',
      user: newUser,
      proposal: newProposal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Função de login de usuário
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verificar se a proposta do usuário foi aprovada
    const proposal = await prisma.proposal.findUnique({
      where: { userId: user.id },
    });

    if (!proposal || proposal.status !== 'APPROVED') {
      return res.status(403).json({ message: 'Proposal is not approved' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    // Retornar o token e as informações do usuário
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

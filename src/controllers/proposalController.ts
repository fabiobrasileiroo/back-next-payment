import { PrismaClient } from '@prisma/client'
import type { Request, Response } from 'express'

const prisma = new PrismaClient()
export const approveProposal = async (req: Request, res: Response) => {
  const { proposalId } = req.body

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { user: true },
    })

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' })
    }

    // Atualizar o status da proposta para APROVADA
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'APPROVED' },
    })

    // Atualizar o usuário para 'USER' após aprovação
    await prisma.user.update({
      where: { id: proposal.userId },
      data: { role: 'USER' },
    })

    res.status(200).json({ message: 'Proposal approved and user activated' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const rejectProposal = async (req: Request, res: Response) => {
  const { proposalId } = req.body

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    })

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' })
    }

    // Atualizar o status da proposta para REJEITADA
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'REJECTED' },
    })

    res.status(200).json({ message: 'Proposal rejected' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
// Função para listar propostas
export const listProposals = async (req: Request, res: Response) => {
  try {
    // Buscar todas as propostas, incluindo informações de usuário, unidade e empresa
    const proposals = await prisma.proposal.findMany({
      include: {
        user: true, // Inclui informações do usuário relacionado à proposta
        unit: true, // Inclui a unidade relacionada à proposta
      },
    })

    res.status(200).json(proposals)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

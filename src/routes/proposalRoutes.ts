import express from 'express'
import { approveProposal,listProposals,rejectProposal } from '@/controllers/proposalController'

const proposalRoutes = express.Router()

// Rota para aprovar proposta
proposalRoutes.post('/approve', approveProposal)

// Rota para rejeitar proposta
proposalRoutes.post('/reject', rejectProposal)

proposalRoutes.get('/proposals', listProposals)


export default proposalRoutes

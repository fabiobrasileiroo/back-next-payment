import express from 'express'
import { createUserInCompany } from '@/controllers/createUserController'
import authenticate from '../middleware/authenticate'
import authorize from '../middleware/authorize'

const createUserRouter = express.Router()

// Rota protegida para criar usuários dentro da empresa do administrador
createUserRouter.post('/create-user', authenticate, authorize(['ADMIN']), createUserInCompany)

export default createUserRouter

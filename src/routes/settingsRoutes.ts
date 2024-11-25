import { UserRole } from '@prisma/client'
import express from 'express'
import authenticate from '../middleware/authenticate' // Middleware de autenticação
import authorize from '../middleware/authorize' // Middleware de autorização
import { getSettings } from '@/controllers/settingsController'

const router = express.Router()

// Middleware de autenticação aplicado globalmente
router.use(authenticate)
router.get('/', getSettings);

export default router;

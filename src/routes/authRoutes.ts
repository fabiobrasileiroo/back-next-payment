import express from 'express'
import { login, register } from '../controllers/authController'
import {
  forgotPassword,
  resetPassword,
} from '@/controllers/passwordResetController'

const authRoutes = express.Router()

// Rota para registro de usuário
authRoutes.post('/register', register)

// Rota para login
authRoutes.post('/login', login)

// Rotas para recuperação de senha
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/reset-password', resetPassword)

export default authRoutes

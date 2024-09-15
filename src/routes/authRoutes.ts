import express from 'express'
import { login, register } from '../controllers/authController'

const authRoutes = express.Router()

// Rota para registro de usuário
authRoutes.post('/register', register)

// Rota para login
authRoutes.post('/login', login)

export default authRoutes

import type { UserRole } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

// Interface para definir o tipo do usuário decodificado
interface DecodedToken {
  id: number
  email: string
  role: UserRole
  // Adicione outros campos conforme necessário
}

// Middleware para autenticação
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Obtenha o token do cabeçalho Authorization
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  // Verifique e decodifique o token
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Anexe o usuário decodificado ao req
    req.user = decoded as DecodedToken

    next()
  })
}

export default authenticate

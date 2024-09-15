import type { UserRole } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

// Defina o tipo DecodedToken de acordo com o que você está codificando no JWT
interface DecodedToken {
  id: number
  email: string
  role: UserRole
  iat?: number // Timestamp de emissão do token (opcional)
  exp?: number // Timestamp de expiração do token (opcional)
}

const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as DecodedToken // Certifique-se de que o tipo está correto

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  }
}

export default authorize

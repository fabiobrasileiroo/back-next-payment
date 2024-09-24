// src/types/express.d.ts
import type { UserRole } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: any
        role: UserRole
        // Adicione outras propriedades do usuário, se necessário
      }
    }
  }
}

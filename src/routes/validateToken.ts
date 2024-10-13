import express from 'express';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client'; // Optional: for user-related info (if needed)

const validateToken = express.Router();
const prisma = new PrismaClient();

// Route for validating JWT tokens
validateToken.post('/validate-token', (req: Request, res: Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ valid: false, message: 'Token is missing' });
  }

  // Verify the token using the JWT secret
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ valid: false, message: 'Invalid token' });
    }

    // Optionally, you could retrieve user information from the database using `decoded.id`
    // Example: const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    // If token is valid, send back valid: true
    res.status(200).json({ valid: true, decoded });
  });
});

export default validateToken;

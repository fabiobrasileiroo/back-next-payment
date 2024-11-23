import express from 'express';
import {
  createUserInCompany,
  getUsersInCompany,
  getUserById,
  updateUser,
  deleteUser,
} from '@/controllers/userController';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

const createUserRouter = express.Router();

// Rota protegida para criar usuários dentro da empresa do administrador
createUserRouter.post(
  '/create-user',
  authenticate,
  authorize(['ADMIN']), // Apenas ADMIN pode criar usuários
  createUserInCompany
);

// Rota protegida para listar usuários na empresa do administrador
createUserRouter.get(
  '/users',
  authenticate,
  authorize(['ADMIN']), // Apenas ADMIN pode listar usuários
  getUsersInCompany
);

// Rota protegida para buscar um único usuário por ID
createUserRouter.get(
  '/users/:id',
  authenticate,
  authorize(['ADMIN']), // Apenas ADMIN pode visualizar um usuário
  getUserById
);

// Rota protegida para atualizar informações de um usuário
createUserRouter.put(
  '/users/:id',
  authenticate,
  authorize(['ADMIN']), // Apenas ADMIN pode atualizar usuários
  updateUser
);

// Rota protegida para deletar um usuário
createUserRouter.delete(
  '/users/:id',
  authenticate,
  authorize(['ADMIN']), // Apenas ADMIN pode deletar usuários
  deleteUser
);

export default createUserRouter;

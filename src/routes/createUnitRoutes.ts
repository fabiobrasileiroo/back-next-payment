import express from 'express';
import {
  createUnitInCompany,
  getUnitsInCompany,
  getUnitById,
  updateUnit,
  deleteUnit,
} from '@/controllers/unitCompanyController'; // Certifique-se de que esses métodos estão no controller
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

const createUnitRouter = express.Router();

// Rota protegida para criar unidades dentro da empresa do administrador
createUnitRouter.post(
  '/units',
  authenticate,
  authorize(['ADMIN']),
  createUnitInCompany
);

// Rota protegida para listar todas as unidades da empresa do administrador
createUnitRouter.get(
  '/units',
  authenticate,
  authorize(['ADMIN']),
  getUnitsInCompany
);

// Rota protegida para buscar uma unidade específica pelo ID
createUnitRouter.get(
  '/units/:id',
  authenticate,
  authorize(['ADMIN']),
  getUnitById
);

// Rota protegida para atualizar uma unidade específica
createUnitRouter.put(
  '/units/:id',
  authenticate,
  authorize(['ADMIN']),
  updateUnit
);

// Rota protegida para deletar uma unidade específica
createUnitRouter.delete(
  '/units/:id',
  authenticate,
  authorize(['ADMIN']),
  deleteUnit
);

export default createUnitRouter;

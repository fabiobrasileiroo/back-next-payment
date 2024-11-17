import { UserRole } from '@prisma/client'
import express from 'express'
import {
  createProduct,
  decrease,
  deleteProduct,
  getProductById,
  getProducts,
  increase,
  stock,
  updateProduct,
  getProductsByCategory,
  deleteProducts,
} from '../controllers/productController'
import authenticate from '../middleware/authenticate' // Middleware de autenticação
import authorize from '../middleware/authorize' // Middleware de autorização

const router = express.Router()

// Middleware de autenticação aplicado globalmente
router.use(authenticate)

// Rotas para produtos com autorização baseada em função de usuário (role)
router.post('/', authorize([UserRole.ADMIN]), createProduct) // Apenas ADMIN pode criar produtos
router.get('/', getProducts) // Acesso público para listar produtos
router.get('/category/:categoryId', getProductsByCategory) // Rota para buscar produtos por categoria
router.get('/:id', getProductById) // Acesso público para obter um produto por ID
router.put('/:id', authorize([UserRole.ADMIN]), updateProduct) // Apenas ADMIN pode atualizar produtos
router.delete('/:id', authorize([UserRole.ADMIN]), deleteProduct) // Apenas ADMIN pode deletar produtos
router.delete('/', authorize([UserRole.ADMIN]), deleteProducts)

// Rotas para manipulação de estoque com autorização baseada em função de usuário (role)
router.put('/:id/decrease', authorize([UserRole.ADMIN]), decrease) // Apenas ADMIN pode diminuir o estoque
router.put('/:id/increase', authorize([UserRole.ADMIN]), increase) // Apenas ADMIN pode aumentar o estoque
router.get('/:id/stock', authorize([UserRole.ADMIN]), stock) // Apenas ADMIN pode verificar o estoque

export default router

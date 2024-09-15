import express from 'express'
import { createProduct, getProducts } from '../controllers/productController.js'

const router = express.Router()

// Rota para criar um novo produto
router.post('/', createProduct)

// Rota para obter todos os produtos
router.get('/', getProducts)

export default router

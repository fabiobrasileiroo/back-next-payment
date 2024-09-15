import express from 'express';
import { createProduct, getProducts } from '../controllers/productController';

const router = express.Router();

// Route to create a new product
router.post('/', createProduct);

// Route to get all products
router.get('/', getProducts);

export default router;

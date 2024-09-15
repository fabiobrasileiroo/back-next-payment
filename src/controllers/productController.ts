import * as productService from '../services/productService';
import type { Request, Response } from 'express';
import type { Product } from '../@types/productTypes';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product: Product = req.body;
    const createdProduct = await productService.createProduct(product);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

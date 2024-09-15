import type { Product } from '@/@types/productTypes'
import type { Request, Response } from 'express'
import * as productService from '../services/productService'

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product: Product | any = req.body
    const createdProduct = await productService.createProduct(product)
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const product = await productService.getProductById(id)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const productData: Partial<Product> = req.body
    const updatedProduct = await productService.updateProduct(id, productData)
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    await productService.deleteProduct(id)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

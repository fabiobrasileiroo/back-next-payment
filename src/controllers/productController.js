import * as productService from '../services/productService.js'

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts()
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

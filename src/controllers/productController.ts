import 'dotenv/config'
import type { Product } from '@/@types/productTypes'
import axios from 'axios'
import type { Request, Response } from 'express'
import * as productService from '../services/productService'
import { DEFAULT_IMAGE_URL } from '@/assets/noImage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: any = req.body
    const base64Image: string = req.body.imageUrl
    const { nameCategory, companyId } = req.body

    // Verifica se o ID da empresa foi fornecido
    if (!companyId) {
      return res.status(400).json({ message: 'ID da empresa é obrigatório' })
    }

    // Processa a imagem, se fornecida
    if (base64Image) {
      const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '')
      const response = await axios.post(
        'https://api.imgbb.com/1/upload',
        {
          key: process.env.IMGBB_API_KEY,
          image: imageData,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      productData.imageUrl = response.data.data.url
    } else {
      productData.imageUrl = DEFAULT_IMAGE_URL
    }

    // Verifica ou cria a categoria
    let categoryId: number | undefined
    if (nameCategory) {
      const category = await prisma.category.upsert({
        where: { name: nameCategory },
        update: {},
        create: { name: nameCategory },
      })
      categoryId = category.id
    }

    // Cria o produto com a empresa associada
    const createdProduct = await productService.createProduct(productData, companyId, categoryId)
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

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number.parseInt(req.params.categoryId, 10)

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'ID da categoria inválido' })
    }

    const products = await productService.getProductsByCategory(categoryId)
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
      res.status(404).json({ message: 'Produto não encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

interface UpdateProductData extends Partial<Product> {
  categoryId?: number
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const productData: UpdateProductData = req.body

    // Verificar se o campo de categoria foi fornecido
    if (req.body.categoryId) {
      productData.categoryId = req.body.categoryId
    }

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

export const decrease = async (req: Request, res: Response) => {
  const { id } = req.params
  const { quantity } = req.body // Quantidade a ser diminuída

  try {
    const updatedProduct = await productService.decreaseProductQuantity(
      Number(id),
      quantity
    )
    return res.json(updatedProduct)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

export const increase = async (req: Request, res: Response) => {
  const { id } = req.params
  const { quantity } = req.body // Quantidade que você quer aumentar

  try {
    const updatedProduct = await productService.increaseProductQuantity(
      Number(id),
      quantity
    )
    return res.json(updatedProduct)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

export const stock = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const stockInfo = await productService.checkProductStock(Number(id))
    return res.json(stockInfo)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

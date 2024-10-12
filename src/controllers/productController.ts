import 'dotenv/config'
import type { Product } from '@/@types/productTypes'
import axios from 'axios'
import type { Request, Response } from 'express'
import { uploadImage } from '../services/imgBbServices'
import * as productService from '../services/productService'

import imgbbUploader from 'imgbb-uploader'
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: Product | any = req.body
    const base64Image: string = req.body.imageUrl // A imagem vem como base64 no corpo da requisição

    if (base64Image) {
      // Remover o cabeçalho 'data:image/jpeg;base64,' ou similar antes de enviar para o imgbb
      const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '')

      // Enviar a imagem base64 para o imgbb
      const response = await axios.post(
        'https://api.imgbb.com/1/upload',
        {
          key: process.env.IMGBB_API_KEY, // Substitua pela sua chave de API
          image: imageData,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      // Adicionar a URL da imagem ao produto
      console.log(response.data.data.url)
      productData.imageUrl = response.data.data.url
    }

    const createdProduct = await productService.createProduct(productData)
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

export const decrease = async (req: Request, res: Response) => {
  const { id } = req.params
  const { quantity } = req.body // quantidade a ser diminuída

  try {
    const updatedProduct = await productService.decreaseProductQuantity(Number(id), quantity)
    return res.json(updatedProduct)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

export const increase = async (req: Request, res: Response) => {
  const { id } = req.params
  const { quantity } = req.body // A quantidade que você quer aumentar

  try {
    // Chama a função para aumentar a quantidade
    const updatedProduct = await productService.increaseProductQuantity(Number(id), quantity)
    return res.json(updatedProduct)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}


export const stock = async (req: Request, res: Response) => {
  const { id } = req.params
  console.log("🚀 ~ stock ~ id:", id)


  try {
    const stockInfo = await productService.checkProductStock(Number(id))
    return res.json(stockInfo)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}
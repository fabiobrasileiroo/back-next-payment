import type { Product } from '@/@types/productTypes'
import type { Request, Response } from 'express'
import * as productService from '../services/productService'
import { uploadImage } from '../services/imgBbServices'
import axios from 'axios'

import imgbbUploader from 'imgbb-uploader'
import fs from 'fs'
import path from 'path'

export const createProduct = async (req: Request, res: Response) => {
  console.log(process.env.IMGBB_API_KEY)
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
          image: imageData
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

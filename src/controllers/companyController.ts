import { companyType } from '@/@types/companyTypes'
import { Request, Response } from 'express'
import * as companyService from '../services/companyService'

export const createCompany = async (req: Request, res: Response) => {
  try {
    const companyData: companyType | any = req.body

    const createdCompany = await companyService.createCompany(companyData)
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Erro ao salvar company no banco de dados ${(error as Error).message}`,
      })
  }
}

export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.getCompany()
    res.status(200).json(company)
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Erro ao consultar listagem no banco de dados ${(error as Error).message}`,
      })
  }
}

export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const company = await companyService.getCompanyById(id)

    if (company) {
      res.status(200).json(company)
    } else {
      res.status(404).json({ message: `Company not found` })
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Erro ao consultar banco de dados ${(error as Error).message}`,
      })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    const companyData: Partial<companyType> = req.body
    const updatedCompany = await companyService.updateCompany(id, companyData)
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Erro no banco de dados ao realizar update ${(error as Error).message}`,
      })
  }
}

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    await companyService.deleteCompany(id)
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Erro no banco de dados ao deletar company ${(error as Error).message}`,
      })
  }
}

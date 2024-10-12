import { companyType } from './companyTypes'

export interface unitType {
  id?: number
  name: string
  company: companyType
  companyId: number
}

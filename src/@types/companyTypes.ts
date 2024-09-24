import { Product } from "./productTypes";
import { unitType } from "./unitType";

export interface companyType {
    id?: number | undefined;
    name: string;
    unit: unitType[]
    products: Product[]
}
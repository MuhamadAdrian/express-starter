import { AppDataSource } from "../../database";
import { ProductCategory } from "../models/ProductCategory";

export const productCategoryRepository = AppDataSource.getRepository(ProductCategory)

export const getProductCategoryById = (id: number) => {
    const category = productCategoryRepository.findOneBy({
        id
    })

    return category
}
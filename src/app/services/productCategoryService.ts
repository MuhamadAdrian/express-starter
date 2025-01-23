import { AppDataSource } from '../../database'
import { ProductCategory } from '../models/ProductCategory'

export const productCategoryRepository =
    AppDataSource.getRepository(ProductCategory)

export const getProductCategoryById = async (id: number) => {
    const category = await productCategoryRepository.findOneBy({
        id,
    })

    return category
}

export const createCategory = async (body: { name: string }) => {
    const category = productCategoryRepository.create(body)

    return await productCategoryRepository.save(category)
}

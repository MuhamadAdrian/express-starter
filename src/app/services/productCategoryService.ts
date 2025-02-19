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

export const updateCategory = async (
    id: number,
    body: {
        name: string
    }
) => {
    const product = await productCategoryRepository.update(
        { id },
        {
            name: body.name,
        }
    )

    if (product.affected === 0) throw new Error('Update failed')

    return body
}

export const createCategory = async (body: { name: string }) => {
    const category = productCategoryRepository.create(body)

    return await productCategoryRepository.save(category)
}

export const getCategories = async ({
    page = 1,
    pageSize = 10,
    search = '',
}: {
    page?: number
    pageSize?: number
    search?: string
}) => {
    try {
        const queryBuilder =
            productCategoryRepository.createQueryBuilder('product_category')

        if (search) {
            queryBuilder.where('product_category.name LIKE :search', {
                search: `%${search}%`,
            })
        }

        queryBuilder.orderBy('product_category.created_at', 'DESC')

        const [products, total] = await queryBuilder
            .select(['product_category.name', 'product_category.id'])
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount()

        return {
            data: products,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
            },
        }
    } catch (error) {
        console.error('Error fetching product category:', error)
        throw new Error('Failed to fetch product category')
    }
}

export const removeCategory = async (id: number) => {
    return await productCategoryRepository.delete({
        id,
    })
}

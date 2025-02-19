import { Request, Response } from 'express'
import {
    createCategory,
    getCategories,
    getProductCategoryById,
    removeCategory,
    updateCategory,
} from '../services/productCategoryService'
import { BaseController } from './BaseController'
import { matchedData } from 'express-validator'

export class ProductCategoryController extends BaseController {
    // List all product categories with pagination
    public static async index(req: Request, res: Response) {
        try {
            const { page = 1, pageSize = 10, search = '' } = req.query
            const { data, pagination } = await getCategories({
                page: Number(page),
                pageSize: Number(pageSize),
                search: String(search),
            })

            super.successResponse(
                res,
                data,
                'Success Fetch Product Category',
                200,
                pagination
            )
        } catch (error) {
            console.error('Error fetching product category:', error)
            super.errorResponse(res, 'Failed to fetch product category')
        }
    }

    public static async store(req: Request, res: Response) {
        try {
            super.validate(req, res)
            const { name } = matchedData(req)

            const category = await createCategory({ name })

            super.successResponse(res, category, 'Successfully create category')
        } catch (error) {
            super.errorResponse(res, error)
        }
    }

    // View a single product by ID
    public static async view(req: Request, res: Response) {
        try {
            const { id } = req.params
            const productCategory = await getProductCategoryById(Number(id))

            if (!productCategory) {
                super.errorResponse(res, 'Product category not found', 404)
                return
            }

            super.successResponse(res, productCategory)
        } catch (error) {
            console.error('Error fetching product category:', error)
            super.errorResponse(res, 'Failed to fetch product category')
        }
    }

    // Update an existing product
    public static async update(req: Request, res: Response) {
        try {
            super.validate(req, res)

            const { id } = req.params
            const productCatgoryData = req.body
            const updatedCategoryProduct = await updateCategory(
                Number(id),
                productCatgoryData
            )

            if (!updatedCategoryProduct) {
                super.errorResponse(res, 'Product category not found', 404)
                return
            }

            super.successResponse(
                res,
                updatedCategoryProduct,
                'Product category updated successfully'
            )
        } catch (error) {
            console.error('Error updating product category:', error)
            super.errorResponse(res, 'Failed to update product category')
        }
    }

    // Delete a product
    public static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            const deleted = await removeCategory(Number(id))

            if (!deleted) {
                super.errorResponse(res, 'Product category not found', 404)
                return
            }

            super.successResponse(
                res,
                null,
                'Product category deleted successfully'
            )
        } catch (error) {
            console.error('Error deleting product category:', error)
            super.errorResponse(res, 'Failed to delete product category')
        }
    }
}

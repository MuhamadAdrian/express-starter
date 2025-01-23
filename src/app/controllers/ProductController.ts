import { Request, Response } from 'express'
import { BaseController } from './BaseController'
import {
    createProduct,
    getProduct,
    getProducts,
    removeProduct,
    updateProduct,
} from '../services/productService'

export class ProductController extends BaseController {
    // List all products with pagination
    public static async index(req: Request, res: Response) {
        try {
            const { page = 1, pageSize = 10, search = '' } = req.query
            const { data, pagination } = await getProducts({
                page: Number(page),
                pageSize: Number(pageSize),
                search: String(search),
            })

            super.successResponse(
                res,
                data,
                'Success Fetch Products',
                200,
                pagination
            )
        } catch (error) {
            console.error('Error fetching products:', error)
            super.errorResponse(res, 'Failed to fetch products')
        }
    }

    // Create a new product
    public static async store(req: Request, res: Response) {
        try {
            super.validate(req, res)

            const productData = req.body
            const product = await createProduct(productData)

            super.successResponse(res, product, 'Product created successfully')
        } catch (error) {
            console.error('Error creating product:', error)
            super.errorResponse(res, 'Failed to create product')
        }
    }

    // View a single product by ID
    public static async view(req: Request, res: Response) {
        try {
            const { id } = req.params
            const product = await getProduct(Number(id))

            if (!product) {
                super.errorResponse(res, 'Product not found', 404)
                return
            }

            super.successResponse(res, product)
        } catch (error) {
            console.error('Error fetching product:', error)
            super.errorResponse(res, 'Failed to fetch product')
        }
    }

    // Update an existing product
    public static async update(req: Request, res: Response) {
        try {
            super.validate(req, res)

            const { id } = req.params
            console.log(id)
            const productData = req.body
            console.log(productData)
            const updatedProduct = await updateProduct(Number(id), productData)

            if (!updatedProduct) {
                super.errorResponse(res, 'Product not found', 404)
                return
            }

            super.successResponse(
                res,
                updatedProduct,
                'Product updated successfully'
            )
        } catch (error) {
            console.error('Error updating product:', error)
            super.errorResponse(res, 'Failed to update product')
        }
    }

    // Delete a product
    public static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            const deleted = await removeProduct(Number(id))

            if (!deleted) {
                super.errorResponse(res, 'Product not found', 404)
                return
            }

            super.successResponse(res, null, 'Product deleted successfully')
        } catch (error) {
            console.error('Error deleting product:', error)
            super.errorResponse(res, 'Failed to delete product')
        }
    }
}

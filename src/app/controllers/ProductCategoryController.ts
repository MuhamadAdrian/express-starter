import { Request, Response } from 'express'
import { createCategory } from '../services/productCategoryService'
import { BaseController } from './BaseController'
import { matchedData } from 'express-validator'

export class ProductCategoryController extends BaseController {
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
}

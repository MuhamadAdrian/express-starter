import express from 'express'
import auth from '../app/middleware/auth'
import { ProductCategoryController } from '../app/controllers/ProductCategoryController'
import productCategorySchema from '../app/schema/productCategorySchema'

const router = express.Router()

router.use(auth)

router.post('', productCategorySchema, ProductCategoryController.store)

export default router

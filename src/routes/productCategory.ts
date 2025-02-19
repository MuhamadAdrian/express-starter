import express from 'express'
import auth from '../app/middleware/auth'
import { ProductCategoryController } from '../app/controllers/ProductCategoryController'
import productCategorySchema from '../app/schema/productCategorySchema'

const router = express.Router()

router.use(auth)

router.get('', ProductCategoryController.index)
router.post('', productCategorySchema, ProductCategoryController.store)
router.put('/:id', productCategorySchema, ProductCategoryController.update)
router.get('/:id', ProductCategoryController.view)
router.delete('/:id', ProductCategoryController.delete)

export default router

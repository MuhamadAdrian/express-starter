import express from 'express'
import { ProductController } from '../app/controllers/ProductController'
import auth from '../app/middleware/auth'
import productSchema from '../app/schema/productSchema'

const router = express.Router()

router.use(auth);

router.get('', ProductController.index)
router.post('', productSchema, ProductController.store)
router.put('/:id', productSchema, ProductController.update)
router.get('/:id', ProductController.view)
router.delete('/:id', ProductController.delete)

export default router

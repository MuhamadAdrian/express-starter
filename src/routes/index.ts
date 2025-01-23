import { Router } from 'express'
import authRouter from './auth'
import productRouter from './product'
import productCategoryRouter from './productCategory'

const router = Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/product-categories', productCategoryRouter)

export default router

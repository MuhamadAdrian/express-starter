import express from 'express'
import { AuthController } from '../app/controllers/AuthController'
import registerValidation from '../app/schema/registerSchema'
import loginValidation from '../app/schema/loginSchema'

const router = express.Router()

router.post('/register', registerValidation, AuthController.register)
router.post('/login', loginValidation, AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/refresh', AuthController.refresh)
router.get('/user', AuthController.user)

export default router

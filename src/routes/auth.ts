import express from 'express'
import { AuthController } from '../app/controllers/AuthController'
import registerValidation from '../app/schema/RegisterSchema'
import loginValidation from '../app/schema/LoginSchema'

const router = express.Router()

router.post('/register', registerValidation, AuthController.register)
router.post('/login', loginValidation, AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/user', AuthController.user)

export default router

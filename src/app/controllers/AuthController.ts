import { Request, Response } from 'express'
import { login, register } from '../services/auth'
import { BaseController } from './BaseController'

export class AuthController extends BaseController {
    public static async register(
        req: Request,
        res: Response,
    ) {
        try {
            const { email, password, name } = req.body
            const user = await register({email, password, name})

            super.successResponse(res, user, 'Register Successfully', 201)
        } catch (error) {
            super.errorResponse(res, error)
        }
    }

    public static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const response = await login(email, password)

            super.successResponse(res, response, 'Login Success')
        } catch (error) {
            super.errorResponse(res, error)
        }
    }
}

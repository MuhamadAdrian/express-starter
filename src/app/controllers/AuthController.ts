import { Request, Response } from 'express'
import {
    getUser,
    login,
    logout,
    refresh,
    register,
} from '../services/authService'
import { BaseController } from './BaseController'
import { matchedData } from 'express-validator'

export class AuthController extends BaseController {
    public static async register(req: Request, res: Response) {
        try {
            super.validate(req, res)

            const { email, password, name } = matchedData(req)

            const user = await register({
                email,
                password,
                name,
            })

            return super.successResponse(
                res,
                user,
                'Register Successfully',
                201
            )
        } catch (error) {
            return super.errorResponse(res, error)
        }
    }

    public static async login(req: Request, res: Response) {
        try {
            super.validate(req, res)

            const { email, password } = req.body
            const response = await login(email, password, req)

            return super.successResponse(res, response, 'Login Success')
        } catch (error) {
            return super.errorResponse(res, error)
        }
    }

    public static async logout(req: Request, res: Response) {
        try {
            await logout(req)

            return super.successResponse(res, null, 'Logout Success')
        } catch (error) {
            return super.errorResponse(res, error)
        }
    }

    public static async refresh(req: Request, res: Response) {
        try {
            super.validate(req, res)

            const { refresh_token } = req.body
            const response = await refresh(refresh_token, req)

            return super.successResponse(res, response, 'Refresh Token Success')
        } catch (error) {
            return super.errorResponse(res, error, 419)
        }
    }

    public static async user(req: Request, res: Response) {
        try {
            const user = await getUser(req)

            return super.successResponse(res, user, 'Success Get User')
        } catch (error) {
            return super.errorResponse(res, error, 403)
        }
    }
}

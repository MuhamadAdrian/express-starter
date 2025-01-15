import { Request, Response, NextFunction } from 'express'
import { login, register } from '../services/auth'

export class AuthController {
    public static async register(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body
            const user = await register(email, password)
            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            const token = await login(email, password)
            res.json({ token })
        } catch (error) {
            next(error)
        }
    }
}

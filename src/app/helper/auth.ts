import { Request } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UAParser } from 'ua-parser-js'

export class Auth {
    public static async verifyAuth(
        req: Request
    ): Promise<{ user: { id: string }; token: string }> {
        const JWT_SECRET = process.env.JWT_SECRET
        const authHeader = req.headers.authorization

        if (!JWT_SECRET) {
            throw new Error('Server misconfiguration: JWT_SECRET is missing')
        }

        if (!authHeader) {
            throw new Error('Authorization header is missing')
        }

        const token = authHeader.split(' ')[1] // Assuming Bearer token format

        if (!token) {
            throw new Error('Token is missing')
        }

        try {
            const user = (await this.verifyToken(token, JWT_SECRET)) as {
                id: string
            }

            return {
                user,
                token,
            }
        } catch (error) {
            console.error(error)
            throw new Error('Invalid or expired token')
        }
    }

    public static async verifyToken(token: string, secret: string) {
        return jwt.verify(token, secret)
    }

    public static async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    public static parseUA(userAgent?: string) {
        const parser = new UAParser(userAgent)

        return parser.getResult()
    }

    public static getUserInfo(parsedUA: UAParser.IResult) {
        return {
            os:
                parsedUA.os.name && parsedUA.os.version
                    ? `${parsedUA.os.name} ${parsedUA.os.version}`
                    : null,
            device_name:
                parsedUA.device.model &&
                parsedUA.device.type &&
                parsedUA.device.vendor
                    ? `${parsedUA.device.type} ${parsedUA.device.vendor} ${parsedUA.device.model}`
                    : null,
        }
    }

    public static generateToken(
        payload: object,
        secret: string,
        expiresIn: string = '1h'
    ): string {
        return jwt.sign(payload, secret, { expiresIn })
    }

    public static async verifyPassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }
}

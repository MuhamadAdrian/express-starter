import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { Session } from '../models/Session'
import { AppDataSource } from '../../database'
import { UAParser } from 'ua-parser-js'
import { Request } from 'express'

const userRepository = AppDataSource.getRepository(User)
const sessionRepository = AppDataSource.getRepository(Session)

export const register = async ({ password, email, name }: Omit<User, 'id'>) => {
    const hashedPassword = await hashPassword(password)

    const user = userRepository.create({
        email,
        password: hashedPassword,
        name,
    })

    await userRepository.save(user)

    return user
}

export const login = async (email: string, password: string, req: Request) => {
    const user = await userRepository.findOneBy({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials')
    }

    if (!process.env.JWT_SECRET) throw new Error('Invalid Configuration')
    if (!process.env.REFRESH_SECRET) throw new Error('Invalid Configuration')

    const token = generateToken({ id: user.id }, String(process.env.JWT_SECRET))
    const refreshToken = generateToken(
        { id: user.id },
        String(process.env.REFRESH_SECRET),
        '2h'
    )

    const userAgent = req.headers['user-agent']
    const ip = (req.headers.forwarded || '127.0.0.1') as string // TODO : get ip public user

    const parsedUA = parseUA(userAgent)
    const { os, device_name } = getUserInfo(parsedUA)

    const userSession = await sessionRepository.findOne({
        where: {
            user: { id: user.id },
            os: os || undefined,
            device_name: device_name || undefined,
            user_agent: userAgent || undefined,
        },
    })

    if (!userSession) {
        await sessionRepository.save({
            user: { id: user.id },
            os: os || undefined,
            device_name: device_name || undefined,
            user_agent: userAgent || undefined,
            ip,
            is_active: true,
            token,
            refresh_token: refreshToken,
            updated_at: new Date(),
        })
    } else {
        await sessionRepository.update(userSession.id, {
            token,
            refresh_token: refreshToken,
            is_active: true,
            updated_at: new Date(),
        })
    }

    return {
        token,
        refresh_token: refreshToken,
        user,
    }
}

export const logout = async (req: Request) => {
    const authorization = req.headers.authorization
    const token = authorization?.split(' ')[1]

    sessionRepository.findOneByOrFail({
        token,
        is_active: true,
    })

    await sessionRepository.update({ token }, { is_active: false })

    return {
        message: 'Logout successful',
    }
}

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export function parseUA(userAgent?: string) {
    const parser = new UAParser(userAgent)

    return parser.getResult()
}

export const getUserInfo = (parsedUA: UAParser.IResult) => {
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

export const generateToken = (
    payload: object,
    secret: string,
    expiresIn: string = '1h'
): string => {
    return jwt.sign(payload, secret, { expiresIn })
}

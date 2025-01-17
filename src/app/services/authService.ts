import { User } from '../models/User'
import { Session } from '../models/Session'
import { AppDataSource } from '../../database'
import { Request } from 'express'
import { Auth } from '../helper/Auth'

const userRepository = AppDataSource.getRepository(User)
const sessionRepository = AppDataSource.getRepository(Session)

export const register = async ({ password, email, name }: Omit<User, 'id'>) => {
    const hashedPassword = await Auth.hashPassword(password)

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

    if (!user || !(await Auth.verifyPassword(password, user.password))) {
        throw new Error('Invalid credentials')
    }

    if (!process.env.JWT_SECRET) throw new Error('Invalid Configuration')
    if (!process.env.REFRESH_SECRET) throw new Error('Invalid Configuration')

    const token = Auth.generateToken(
        { id: user.id },
        String(process.env.JWT_SECRET)
    )
    const refreshToken = Auth.generateToken(
        { id: user.id },
        String(process.env.REFRESH_SECRET),
        '2h'
    )

    const userAgent = req.headers['user-agent']
    const ip = (req.headers.forwarded || '127.0.0.1') as string // TODO : get ip public user

    const parsedUA = Auth.parseUA(userAgent)
    const { os, device_name } = Auth.getUserInfo(parsedUA)

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

export const getUser = async (req: Request) => {
    const { user: decodedUser, token } = await Auth.verifyAuth(req)

    const session = await sessionRepository.findOneBy({
        user: { id: Number(decodedUser.id) },
        token: token,
    })

    if (!session || !session.is_active) throw new Error('Please login first')

    const user = await userRepository
        .createQueryBuilder('user')
        .select(['user.name', 'user.email', 'user.id'])
        .where('user.id = :id', { id: decodedUser.id })
        .getOne()

    return user
}

export const refresh = async (refreshToken: string, req: Request) => {
    if (!refreshToken) throw new Error('No refresh token provided')

    const { user: decodedUser } = await Auth.verifyAuth(req)

    // Retrieve user associated with the token
    const user = await userRepository.findOneBy({
        id: Number(decodedUser?.id),
    })

    if (!user) {
        throw new Error('User not found')
    }

    if (!process.env.JWT_SECRET) throw new Error('Invalid Configuration')
    if (!process.env.REFRESH_SECRET) throw new Error('Invalid Configuration')

    const token = Auth.generateToken(
        { id: user.id },
        String(process.env.JWT_SECRET)
    )
    const newRefreshToken = Auth.generateToken(
        { id: user.id },
        String(process.env.REFRESH_SECRET),
        '2h'
    )

    const userAgent = req.headers['user-agent']
    const ip = (req.headers.forwarded || '127.0.0.1') as string // TODO : get ip public user

    const parsedUA = Auth.parseUA(userAgent)
    const { os, device_name } = Auth.getUserInfo(parsedUA)

    const userSession = await sessionRepository.findOne({
        where: {
            user: { id: user.id },
            os: os || undefined,
            device_name: device_name || undefined,
            user_agent: userAgent || undefined,
            refresh_token: refreshToken,
        },
    })

    if (!userSession || !userSession.is_active)
        throw new Error('Please login first')

    await sessionRepository.update(userSession.id, {
        token,
        refresh_token: newRefreshToken,
        is_active: true,
        updated_at: new Date(),
        ip,
    })

    return {
        token,
        refresh_token: newRefreshToken,
        user,
    }
}

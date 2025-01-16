import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { AppDataSource } from '../../database'

const userRepository = AppDataSource.getRepository(User)

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

export const login = async (email: string, password: string) => {
    const user = await userRepository.findOneBy({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials')
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    })
    return {
        token,
        user,
    }
}

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

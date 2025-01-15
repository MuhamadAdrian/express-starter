import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { AppDataSource } from '../../database'

const userRepository = AppDataSource.getRepository(User)

export const register = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = userRepository.create({ email, password: hashedPassword })
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
    return token
}

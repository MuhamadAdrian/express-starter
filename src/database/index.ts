import 'reflect-metadata'
import { DataSource } from 'typeorm'
import database from '../app/config/database'

const { username, password, host, port, database: name } = database

export const AppDataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database: name,
    synchronize: true,
    logging: false,
    entities: ['src/app/models/**/*.ts'],
    migrations: ['src/database/migrations/*.ts'],
})

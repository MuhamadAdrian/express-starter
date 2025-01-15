import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import { AppDataSource } from './database'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api', routes)

// Connect to Database
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected')
    })
    .catch((error) => console.error(error))

export default app

import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import { AppDataSource } from './database'
import corsConfig from './app/config/cors'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors(corsConfig));
app.use(express.json())
app.use('/api', routes)

// Connect to Database
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected')
    })
    .catch((error) => console.error(error))

export default app

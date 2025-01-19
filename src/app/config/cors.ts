import { CorsOptions } from "cors";
import dotenv from 'dotenv'

dotenv.config()

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS

export default {
    origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
    preflightContinue: false,
    credentials: true
} as CorsOptions
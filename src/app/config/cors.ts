import { CorsOptions } from "cors";
import dotenv from 'dotenv'

dotenv.config()

export default {
    origin: process.env.ALLOWED_ORIGINS ?? ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
    preflightContinue: false,
    credentials: true
} as CorsOptions
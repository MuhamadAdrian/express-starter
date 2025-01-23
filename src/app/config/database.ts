import dotenv from 'dotenv'
// Database configuration settings

dotenv.config()

// The port number on which the database server is running, defaulting to '5432' if not specified.
export const port = Number(process.env.DB_PORT ?? 5432)

// The hostname of the database server, defaulting to 'localhost' if not specified.
export const host = process.env.DB_HOST ?? 'localhost'

// The name of the database to connect to, defaulting to 'express' if not specified.
export const database = process.env.DB_DATABASE ?? 'sample'

// The username for authenticating with the database, defaulting to 'postgres' if not specified.
export const username = process.env.DB_USERNAME ?? 'postgres'

// The password for authenticating with the database, defaulting to an empty string if not specified.
export const password = process.env.DB_PASSWORD ?? ''

export default { port, host, database, username, password }

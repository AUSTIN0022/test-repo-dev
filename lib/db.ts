import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
const isLocal = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1')

export const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
})
export const db = drizzle(pool)


import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { PRIVATE_SUPABASE_DATABASE_URL } from '$env/static/private'

export const client = postgres(PRIVATE_SUPABASE_DATABASE_URL, { prepare: false })
export const db = drizzle(client, { schema })

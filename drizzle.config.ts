import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/pushableSchema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.PRIVATE_SUPABASE_DATABASE_URL!,
  },
})

// This file exists because `schema.ts` needs to `export { authUsers }` to expose the Supabase Authentication users table,
// which is required for Drizzle `relations` on the `profileTable` to work properly, but then if we tried to 
// `drizzle-kit generate && drizzle-kit migrate` with `drizzle.config.ts` having `schema: './src/lib/db/schema.ts'`, 
// then we would get an error about trying to modify the `authUsers` table under the `auth` schema in Supabase (we are
// not supposed to touch that table/schema).
// 
// This solution feels a little hacky, and I think Supabase should handle this better, but for now we can just
// export any "internal" tables from this file and call it our "pushable schema", and use it in `drizzle.config.ts`
// so any `drizzle-kit generate && drizzle-kit migrate` only export these tables.
import { profileTable } from './schema'

export { profileTable }

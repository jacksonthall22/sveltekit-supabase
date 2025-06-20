// Note: Drizzle is currently bugged with how it sets RLS policies using `drizzle-kit push`:
//
//    https://github.com/drizzle-team/drizzle-orm/issues/3504
//
// Until that's resolved, you can either use migrations, or if you don't want to deal with them,
// this flow worked for me for TESTING ONLY (WILL DELETE YOUR DATABASES AND ALL DATA IN SUPABASE):
//
//   1. Make changes here, to schema, RLS, etc.
//   2. Comment out this whole file
//   3. `drizzle-kit push` - DESTRUCTIVE, deletes all your tables and their data in Supabase
//   4. Uncomment this file
//   5. `rm -rf drizzle` - DESTRUCTIVE, removes any previous migrations stored in `drizzle` folder
//   5. `drizzle-kit generate && drizzle-kit migrate` - generates SQL migrations (where RLS gets set correctly) and "pushes" changes
//
// Note: Sometimes you may also want to delete the `__drizzle_migrations` table under the `drizzle` schema in Supabase Table Editor

import { eq, relations } from 'drizzle-orm'
import { pgPolicy, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

// This export is required for Drizzle relations to work properly
export { authUsers }

export const profileTable = pgTable(
  'profile',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    firstName: text('first_name'),
    lastName: text('last_name'),
  },
  (t) => [
    pgPolicy('Enable users to view their own data only', {
      as: 'permissive',
      to: authenticatedRole,
      for: 'select',
      using: eq(t.id, authUid),
    }),
    pgPolicy('Enable users to insert their own data only', {
      as: 'permissive',
      to: authenticatedRole,
      for: 'insert',
      withCheck: eq(t.id, authUid),
    }),
    pgPolicy('Enable users to update their own data only, not changing ID', {
      as: 'permissive',
      to: authenticatedRole,
      for: 'update',
      using: eq(t.id, authUid),
      withCheck: eq(t.id, authUid),
    }),
    pgPolicy('Enable users to delete their own data only', {
      as: 'permissive',
      to: authenticatedRole,
      for: 'delete',
      using: eq(t.id, authUid),
    }),
  ],
)

export const profileTableSelectSchema = createSelectSchema(profileTable)
export const profileTableUpdateSchema = createUpdateSchema(profileTable)
export const profileTableInsertSchema = createInsertSchema(profileTable)

export const authUsersRelations = relations(authUsers, ({ one }) => ({
  profile: one(profileTable),
}))

export const profileTableRelations = relations(profileTable, ({ one }) => ({
  authUser: one(authUsers, { fields: [profileTable.id], references: [authUsers.id] }),
}))

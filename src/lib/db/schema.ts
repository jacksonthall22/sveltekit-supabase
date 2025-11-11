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

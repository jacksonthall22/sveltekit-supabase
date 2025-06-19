import { db } from '$lib/db'
import { profileTable } from '$lib/db/schema'
import { fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { Actions } from './$types'

export const actions = {
  default: async ({ locals }) => {
    const { supabase, supabaseAdmin, user } = locals
    if (!user) return fail(401, { error: 'Unauthorized' })

    // Delete the user data from the `profile` table. We do this as a transaction in case we
    // find ourself in any unexpected state (read below).
    await db.transaction(async (tx) => {
      const deletedRows = await db
        .delete(profileTable)
        .where(eq(profileTable.id, user.id))
        .returning()

      // User has a session in `event.locals.user`, but no corresponding row in the `profile` table 
      // (we should have created the user's profile data when they signed up).
      if (deletedRows.length === 0) {
        tx.rollback()
        return fail(500, { error: 'Failed to delete user data' })
      }

      // Sanity check that we didn't delete multiple rows (this would mean the user ID was not unique).
      if (deletedRows.length > 1) {
        tx.rollback()
        return fail(500, { error: 'Server error' })
      }

      // Sign the user out
      await supabase.auth.signOut()
  
      // Delete user account
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
      if (authError) {
        tx.rollback()
        return fail(500, { error: 'Failed to delete user' })
      }
    })

    return redirect(303, '/')
  },
} satisfies Actions

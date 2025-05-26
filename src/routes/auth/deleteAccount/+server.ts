import { db } from '$lib/db'
import { profileTable } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'

export const DELETE: RequestHandler = async ({ request, locals }) => {
  const { supabaseAdmin, user } = locals
  if (!user) return error(401, 'Unauthorized')

  const { userId } = await request.json()
  if (!userId) return error(400, 'User ID is required')
  if (userId !== user.id) return error(403, 'You can only delete your own account') // RLS should also prevent this

  // Delete the user from the `profile` table. We do this as a transaction in case we are in an unexpected states (read below).
  await db.transaction(async (tx) => {
    const deletedRows = await db.delete(profileTable).where(eq(profileTable.id, userId)).returning()

    // User has a session in `event.locals.user`, but no corresponding row in the `profile` table (we should have created
    // the user's profile data when they signed up).
    if (deletedRows.length === 0) {
      tx.rollback()
      return error(500, 'Failed to delete user data')
    }

    // Sanity check that we didn't delete multiple rows (this would mean the user ID was not unique).
    if (deletedRows.length > 1) {
      tx.rollback()
      return error(500, 'Server error')
    }
  })

  const { data, error: supabaseError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (supabaseError) return error(500, 'Failed to delete user')

  return json({ success: true, data })
}

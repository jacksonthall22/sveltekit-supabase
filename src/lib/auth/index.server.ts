import { db } from '$lib/db'
import { profileTable } from '$lib/db/schema'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

/**
 * Get or create the **stored** user profile from the database, based on the `user` in `locals.safeGetSession()`.
 * If one does not exist, returns a 500 error.
 * @param locals
 * @returns
 */
export const getOrCreateUserProfile = async (locals: App.Locals) => {
  const { user } = await locals.safeGetSession()
  if (!user) error(500, 'Unauthorized')

  // If user data already exists in db, return it
  const profile = await db.query.profileTable.findFirst({
    where: eq(profileTable.id, user.id),
  })
  if (profile) return profile

  // Otherwise create a new one
  await db.insert(profileTable).values({
    id: user.id,
    firstName: '',
    lastName: '',
  })

  const newProfile = await db.query.profileTable.findFirst({
    where: eq(profileTable.id, user.id),
  })
  if (!newProfile) error(500, 'Could not create profile')

  return newProfile
}

import { getOrCreateUserProfile } from '$lib/auth/index.server'
import { db } from '$lib/db/index.js'
import { profileTable } from '$lib/db/schema.js'
import { error, fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
})

export const load: PageServerLoad = async ({ locals }) => {
  // User session is the data stored in Supabase - this includes things like the unique user ID, email,
  // and other user data that doesn't change frequently (ex. stuff tied to auth).
  let userSession = await locals.safeGetSession()

  // Supabase recommends using your own database to store other user data that may change more frequently
  // and have its primary key be the user ID from Supabase.
  let userData
  if (userSession.session) {
    userData = await getOrCreateUserProfile(locals)
  } else {
    userData = undefined
  }

  const form = await superValidate(userData ?? {}, zod(schema))
  if (!form.valid) throw error(500, { message: 'Failed to initialize form' })

  return { form }
}

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(schema))
    if (!form.valid) return fail(400, { form })

    const user = await locals.safeGetSession()
    if (!user) return fail(401, { form })

    const userProfile = await getOrCreateUserProfile(locals)

    try {
      await db
        .update(profileTable)
        .set({
          firstName: form.data.firstName,
          lastName: form.data.lastName,
        })
        .where(eq(profileTable.id, userProfile.id))
    } catch (error) {
      return fail(500, { error: 'Failed to update profile', form })
    }

    return message(form, 'Profile updated!')
  },
} satisfies Actions

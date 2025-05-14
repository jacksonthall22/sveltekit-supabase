import { getOrCreateUserProfile } from '$lib/auth/index.server'
import { db } from '$lib/db/index.js'
import { profileTable } from '$lib/db/schema.js'
import { error, fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad } from './$types'

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional()
})

export const load: PageServerLoad = async ({ locals }) => {
  let userProfile
  try {
    userProfile = await getOrCreateUserProfile(locals)
  } catch {
    // Unauthorized
    userProfile = undefined
  }

  let form
  if (!userProfile) {
    form = await superValidate(zod(formSchema))
  } else {
    form = await superValidate(userProfile, zod(formSchema))
    if (!form.valid) throw error(500, { message: 'Failed to create form with user data' })
  }

  return { form }
}

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(formSchema))
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
          email: form.data.email
        })
        .where(eq(profileTable.id, userProfile.id))
    } catch (error) {
      return fail(500, { error: 'Failed to update profile', form })
    }

    return message(form, 'Profile updated successfully!')
  }
}

import { db } from '$lib/db/index.js'
import { profileTable } from '$lib/db/schema.js'
import { error, json, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { getOrCreateUserProfile } from '$lib/auth/index.server'
import { z } from 'zod'
import { superValidate, type SuperValidated } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

const formSchema = z.object({
  firstName: z.string().default(''),
  lastName: z.string().default(''),
  email: z.string().email().default(''),
})

export type UpdateProfileFormValidated = SuperValidated<z.infer<typeof formSchema>>

export const load: PageServerLoad = async ({ locals }) => {
  const userProfile = await getOrCreateUserProfile(locals)
  // console.log(`[load] test: userProfile:`, userProfile)
  // console.log(`[load] test: locals:`, locals)

  const form = await superValidate(userProfile, zod(formSchema))
  // console.log(`[load] test: form:`, form)

  return { form }
}

export const actions = {
  default: async ({ request, locals }) => {
    const user = await locals.safeGetSession()
    if (!user) {
      return error(401, 'Unauthorized')
    }

    const userProfile = await getOrCreateUserProfile(locals)

    if (!userProfile) {
      return error(401, 'Unauthorized')
    }

    const form = await superValidate(request, zod(formSchema))
    // console.log(`[actions] form:`, form)

    if (!form) {
      return error(400, `Invalid form data`)
    }

    await db
      .update(profileTable)
      .set({
        firstName: form.data.firstName,
        lastName: form.data.lastName,
        email: form.data.email
      })
      .where(eq(profileTable.id, userProfile.id))

    return { success: true, form }
  }
}

import { db } from '$lib/db/index.js'
import { profileTable } from '$lib/db/schema.js'
import { error, fail, json, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'
import { getOrCreateUserProfile } from '$lib/auth/index.server'
import { z } from 'zod'
import { superValidate, type SuperValidated } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

const formSchema = z.object({
  firstName: z.string().default(''),
  lastName: z.string().default(''),
  email: z.string().email().default('')
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
    const user = await locals.safeGetSession()  
    if (!user) return fail(401, { error: 'Unauthorized', form: null })

    const userProfile = await getOrCreateUserProfile(locals)
  
    console.log('test: userProfile:', userProfile)
    console.log('test: request:', request)
    const form = await superValidate(request, zod(formSchema))
    if (!form.valid) return fail(400, { error: `Invalid form data`, form: null })

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

    return { success: true, form }
  }
}

import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import { getOrCreateUserProfile } from '$lib/auth/index.server'
import { message, superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { error } from '@sveltejs/kit'

const schema = z.object({
  email: z.string().email(),
})

export const load = async ({ locals }) => {
  try {
    const { user } = await locals.safeGetSession()
    let email: string | undefined = undefined
    if (user) {
      // Supabase user object should always have an email set
      if (!user.email) return error(500, { message: 'Internal error' })
      email = user.email
    }

    // Get other user profile data from the database
    const userProfile = await getOrCreateUserProfile(locals)

    const form = await superValidate({ email }, zod(schema))
    form.message = `You're already signed in! Welcome back, ${userProfile.firstName}!`
    return { form }
  } catch (error) {
    const form = await superValidate(zod(schema))
    return { form }
  }
}

export const actions = {
  default: async ({ url, request, locals }) => {
    const { supabase } = locals
    const form = await superValidate(request, zod(schema))

    const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
      redirectTo: 'http://localhost:5173/auth/confirm',
    })

    if (error) {
      if (error.status === 429)
        return fail(429, { form, error: 'Too many requests. Please try again later.' })
      return fail(400, { form })
    }

    return message(form, 'Password reset email sent! Please check your inbox.')
  },
} satisfies Actions

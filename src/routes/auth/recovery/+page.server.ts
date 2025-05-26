import { getOrCreateUserProfile } from '$lib/auth/index.server'
import { error, fail } from '@sveltejs/kit'
import { zod } from 'sveltekit-superforms/adapters'
import { message, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { Actions } from './$types'

const schema = z.object({
  email: z.string().email(),
})

export const load = async ({ locals }) => {
  try {
    const { user } = await locals.safeGetSession()
    let email: string | undefined = undefined
    if (user) {
      // Supabase user object should always have an email set
      if (!user.email) error(500, 'Internal error')
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
  default: async ({ request, locals }) => {
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

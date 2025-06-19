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
  const { user } = await locals.safeGetSession()

  // Return empty form if the user is not logged in (account recovery)
  if (!user) {
    const form = await superValidate(zod(schema))
    return { form }
  }

  // Otherwise, pre-fill form with the user's email if logged in (password reset)
  const form = await superValidate({ email: user.email }, zod(schema))
  return { form }
}

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(schema))
    if (!form.valid) return fail(400, { form })

    const { supabase } = locals
    const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
      redirectTo: 'http://localhost:5173/auth/confirm', // TODO: Use a dynamic URL
    })

    if (error) {
      if (error.status === 429)
        return fail(429, { form, error: 'Too many requests. Please try again later.' })
      return fail(500, { form })
    }

    return message(
      form,
      `If your email exists in our database, we've sent a email to reset your password!`,
    )
  },
} satisfies Actions

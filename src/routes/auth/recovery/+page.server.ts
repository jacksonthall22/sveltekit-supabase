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
  if (user) {
    const form = await superValidate({ email: user.email }, zod(schema))
    return { form }
  } else {
    const form = await superValidate(zod(schema))
    return { form }
  }
}

export const actions = {
  default: async ({ request, locals }) => {
    const { supabase } = locals
    const form = await superValidate(request, zod(schema))
    if (!form.valid) return fail(400, { form })

    const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
      redirectTo: 'http://localhost:5173/auth/confirm',
    })

    if (error) {
      if (error.status === 429)
        return fail(429, { form, error: 'Too many requests. Please try again later.' })
      return fail(500, { form })
    }

    return message(form, 'Password reset email sent! Please check your inbox.')
  },
} satisfies Actions

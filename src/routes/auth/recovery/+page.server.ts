import { PUBLIC_SITE_URL } from '$env/static/public'
import { fail, redirect } from '@sveltejs/kit'
import { zod } from 'sveltekit-superforms/adapters'
import { message, superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'
import type { Actions } from './$types'
import { route } from '$lib/ROUTES'

const schema = z.object({
  email: z.string().email(),
})

export const load = async ({ locals }) => {
  const { user } = await locals.safeGetSession()

  // If the user is logged in, we can redirect them to reset password, email recovery won't be necessary
  if (user) redirect(303, route('/auth/reset-password'))

  const form = await superValidate(zod(schema))
  return { form }
}

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(schema))
    if (!form.valid) return fail(400, { form })

    const { supabase } = locals
    const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
      redirectTo: PUBLIC_SITE_URL + route('/auth/reset-password'),
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

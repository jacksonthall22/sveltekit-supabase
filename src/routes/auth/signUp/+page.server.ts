import { MIN_PASSWORD_LENGTH } from '$lib/constants'
import { db } from '$lib/db'
import { profileTable } from '$lib/db/schema'
import { fail, redirect } from '@sveltejs/kit'
import type { SuperValidated } from 'sveltekit-superforms'
import { setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH),
})

export type SignUpFormValidated = SuperValidated<z.infer<typeof schema>>

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(schema))
  return { form }
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(schema))

    if (!form.valid) return fail(400, { form })

    // Check if passwords match
    if (form.data.password !== form.data.confirmPassword)
      return setError(form, 'confirmPassword', 'Passwords do not match')


    const { error: authError, data } = await supabase.auth.signUp({
      email: form.data.email,
      password: form.data.password,
      options: PUBLIC_USE_HCAPTCHA ? { captchaToken: form.data.hCaptchaToken! } : undefined,
    })
    if (authError) {
      if (authError.code === 'user_already_exists')
        return setError(form, 'email', 'Email already in use')
      return fail(500, { authError, form })
    }

    // If there was no error above, then the `profile` table should have a new row with `id` as
    // the same Supabase Auth `id` of the newly created user. Update that row with the user's first/last name.
    const row = await db
      .insert(profileTable)
      .values({ id: data.user!.id, firstName: form.data.firstName, lastName: form.data.lastName })
      .returning()
    if (!row || row.length === 0)
      fail(500, { form, error: 'Failed to create user profile in database' })

    return redirect(303, '/')
  },
} satisfies Actions

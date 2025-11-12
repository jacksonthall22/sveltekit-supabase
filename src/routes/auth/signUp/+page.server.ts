import { MIN_PASSWORD_LENGTH } from '$lib/constants'
import { db } from '$lib/db'
import { profileTable } from '$lib/db/schema'
import { route } from '$lib/ROUTES'
import { fail, redirect } from '@sveltejs/kit'
import type { SuperValidated } from 'sveltekit-superforms'
import { setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { eq } from 'drizzle-orm'

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH),
  hcaptchaToken: z.string(),
})

export type SignUpFormValidated = SuperValidated<z.infer<typeof schema>>

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(schema))
  return { form }
}

const GENERIC_FAIL_MESSAGE = 'Failed to create user, please reach out to support.'

export const actions = {
  default: async ({ request, locals: { supabase, user } }) => {
    const form = await superValidate(request, zod(schema))

    // Check if form is valid
    if (!form.valid) return fail(400, { form })

    // Check if passwords match
    if (form.data.password !== form.data.confirmPassword)
      return setError(form, 'confirmPassword', 'Passwords do not match')

    // Check that hCaptcha was completed
    if (!form.data.hcaptchaToken)
      return setError(form, 'hcaptchaToken', 'Please complete hCaptcha challenge')

    // User should only already exist if it was an anonymous sign-in (which are a TODO).
    // If user is anonymous, update existing row in Supabase-managed auth table with the new
    // email/password. Otherwise must create new user.
    let data
    if (user) {
      // Non-anonymous logged-in user should have been redirected to `/profile` from `+hooks.server.ts`
      if (!user.is_anonymous) {
        setError(form, GENERIC_FAIL_MESSAGE, { status: 500 })
        return fail(500, { form, error: 'Anonymous user already exists' })
      }

      // We expect to find an existing row in the auth table, not the custom `profileTable`.
      // If we do have one, we got into a bad state.
      const existingRow = await db.query.profileTable.findFirst({
        where: eq(profileTable.id, user.id),
      })
      if (existingRow) {
        setError(form, GENERIC_FAIL_MESSAGE, { status: 500 })
        return fail(500, { form, error: 'User profile data already exists' })
      }

      // Update email/password of the anonymous user
      const result = await supabase.auth.updateUser({
        email: form.data.email,
        password: form.data.password,
      })
      data = result.data
      if (result.error) {
        setError(form, GENERIC_FAIL_MESSAGE, { status: 500 })
        return fail(500, { error: 'Failed to update anonymous user', form })
      }
    } else {
      // No current user - create a new one
      const result = await supabase.auth.signUp({
        email: form.data.email,
        password: form.data.password,
        options: {
          captchaToken: form.data.hcaptchaToken,
        },
      })
      data = result.data
      if (result.error) {
        if (result.error.code == 'weak_password') return setError(form, 'password', 'Weak password')

        if (result.error.code == 'captcha_failed')
          return setError(form, 'hcaptchaToken', 'Captcha verification failed', { status: 422 })

        if (result.error.code == 'user_already_exists')
          return setError(form, 'email', 'User already exists', { status: 409 })

        setError(form, 'Failed to create user, please check form details and try again.', {
          status: 422,
        })
        return fail(500, { error: 'Failed to create new user', form })
      }
    }

    // Create a row in custom `profileTable` with other account info
    const row = await db
      .insert(profileTable)
      .values({ id: data.user!.id, firstName: form.data.firstName, lastName: form.data.lastName })
      .returning()
    if (!row.length) {
      setError(form, GENERIC_FAIL_MESSAGE, { status: 500 })
      return fail(500, { form, error: 'Failed to create user profile in database' })
    }

    return redirect(303, route('/'))
  },
} satisfies Actions

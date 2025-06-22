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
})

export type SignUpFormValidated = SuperValidated<z.infer<typeof schema>>

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(schema))
  return { form }
}

export const actions = {
  default: async ({ request, locals: { supabase, user } }) => {
    const form = await superValidate(request, zod(schema))

    // Check if form is valid
    if (!form.valid) return fail(400, { form })

    // Check if passwords match
    if (form.data.password !== form.data.confirmPassword)
      return setError(form, 'confirmPassword', 'Passwords do not match')

    // Non-anonymous logged-in user should have been redirected to `/profile` from `+hooks.server.ts`
    if (!user.is_anonymous) return fail(500, { form, error: 'User is already logged in' })

    const existingRow = await db.query.profileTable.findFirst({
      where: eq(profileTable.id, user.id),
    })
    if (existingRow) return fail(500, { form, error: 'User profile already exists' })

    const { error: authError, data } = await supabase.auth.updateUser({
      email: form.data.email,
      password: form.data.password,
    })
    if (authError) return fail(500, { authError, form })

    // Create profile record
    const row = await db
      .insert(profileTable)
      .values({ id: data.user!.id, firstName: form.data.firstName, lastName: form.data.lastName })
      .returning()
    if (!row.length)
      return fail(500, { form, error: 'Failed to create user profile in database' })

    return redirect(303, route('/'))
  },
} satisfies Actions

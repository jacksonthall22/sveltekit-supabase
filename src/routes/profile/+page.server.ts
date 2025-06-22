import { db } from '$lib/db/index.js'
import { profileTable, profileTableUpdateSchema } from '$lib/db/schema.js'
import { error, fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { route } from '$lib/ROUTES'

const schema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
})

export const load: PageServerLoad = async ({ locals }) => {
  // User session is the data stored in Supabase - this includes things like the unique user ID, email,
  // and other user data that doesn't change frequently (ex. stuff tied to auth).
  const { user } = await locals.safeGetSession()
  if (!user || user.is_anonymous) redirect(303, route('/auth/signIn'))

  // Supabase recommends using your own database to store "additional" user data that may change more frequently
  // and have its primary key be the user ID from Supabase.
  const userData = await db.query.profileTable.findFirst({
    where: eq(profileTable.id, user.id),
    with: {
      authUser: {},
    },
  })
  if (!userData) error(500, 'Database integrity error: no row found for user')

  const form = await superValidate(userData, zod(schema))
  if (!form.valid) error(500, { message: 'Failed to initialize form' })

  return { form }
}

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, zod(schema))

    // Verify that the user is logged in
    const { user } = await locals.safeGetSession()
    if (!user) return fail(401, { form })

    // Validate form submission
    if (!form.valid) return fail(400, { form })

    // Sanity check that a row for the user already exists in the `profile` table
    if (
      !(await db.query.profileTable.findFirst({
        where: eq(profileTable.id, user.id),
      }))
    )
      return fail(500, { form, error: 'Database integrity error: no row found for user' })

    // Validate form data against the `profile` table schema
    const formDataParsed = profileTableUpdateSchema.safeParse(form.data)
    if (!formDataParsed.success)
      return fail(500, { form, error: 'Internal error: database schema has changed' })

    const updateValues = formDataParsed.data
    try {
      await db.update(profileTable).set(updateValues).where(eq(profileTable.id, user.id))
    } catch (error) {
      return fail(500, { error: 'Failed to update profile', form })
    }

    return message(form, 'Profile updated!')
  },
} satisfies Actions

import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { route } from '$lib/ROUTES'

export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession()
  if (user && !user.is_anonymous) redirect(303, route('/profile'))
}

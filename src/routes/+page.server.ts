import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { route } from '$lib/ROUTES'

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession()
  if (user) redirect(303, route('/profile'))
}

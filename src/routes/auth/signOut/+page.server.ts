import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
  default: async ({ locals: { supabase } }) => {
    const { error: logoutError } = await supabase.auth.signOut()
    if (logoutError) return fail(500, { error: 'Logout failed' })
    redirect(303, '/')
  },
} satisfies Actions

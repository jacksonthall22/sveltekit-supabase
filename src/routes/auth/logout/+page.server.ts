import { fail, json, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
  default: async ({ locals: { supabase } }) => {
    console.log('test: [+page.server.ts] Logout action')
    const { error: logoutError } = await supabase.auth.signOut()
    console.log('test: [+page.server.ts] Logout error:', logoutError)
    if (logoutError) return fail(500, { error: 'Logout failed' })
    // return redirect(307, '/auth/signIn')
    return json({ success: true })
  }
} satisfies Actions
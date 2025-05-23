import { error, json, redirect } from '@sveltejs/kit'

export const POST = async ({ locals: { supabase } }) => {
  console.log('test: [+server.ts] Logout action')
  const { error: logoutError } = await supabase.auth.signOut()
  console.log('test: [+server.ts] Logout error:', logoutError)
  if (logoutError) return error(500, 'Logout failed')
  // return redirect(307, '/auth/signIn')
  return json({ success: true })
}

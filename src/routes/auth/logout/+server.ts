import { error, redirect } from '@sveltejs/kit'

export const POST = async ({ locals: { supabase } }) => {
  const { error: logoutError } = await supabase.auth.signOut()
  if (logoutError) return error(500, 'Logout failed')
  return redirect(307, '/auth/signIn')
}

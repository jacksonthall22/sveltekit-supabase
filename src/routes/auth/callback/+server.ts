import { error, redirect } from '@sveltejs/kit'

export const GET = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event
  const code = url.searchParams.get('code') as string
  const next = url.searchParams.get('next') ?? '/'

  // Return the user to an error page with instructions
  // TODO: Figure out what a good behavior is here
  if (!code) error(400, { message: 'Authorization code is missing' })
  // redirect(303, '/auth/auth-code-error')

  const { error: authError } = await supabase.auth.exchangeCodeForSession(code)
  if (authError) error(500, 'Failed to exchange code for session')
  redirect(303, `/${next.slice(1)}`)
}

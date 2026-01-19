import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/'

  /**
   * Build the redirect URL from `next` (absolute or relative),
   * then clean up the Auth flow parameters.
   */
  const redirectTo = new URL(next, url)
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({ type, token_hash })
    if (verifyError) {
      if (verifyError.status === 429)
        error(429, {
          message: 'Too many requests. Please try again later.',
        })
      error(400, 'Invalid token or token expired.')
    }

    redirectTo.searchParams.delete('next')
    redirect(303, redirectTo)
  }

  const errorRedirect = new URL('/auth/error', url)
  errorRedirect.searchParams.set('next', next)
  redirect(303, errorRedirect)
}

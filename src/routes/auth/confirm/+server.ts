import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/'

  /**
   * Clean up the redirect URL by deleting the Auth flow parameters.
   *
   * `next` is preserved for now, because it's needed in the error case.
   */
  const redirectTo = new URL(url)
  redirectTo.pathname = next
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

  redirectTo.pathname = '/auth/error'
  redirect(303, redirectTo)
}

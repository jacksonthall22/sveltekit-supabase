import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  /**
   * Declare a dependency so the layout can be invalidated, for example, on
   * session refresh.
   */
  depends('supabase:auth')

  const supabase =
    isBrowser() ?
      createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return data.cookies
          },
        },
      })

  /**
   * It's fine to use `getSession` here, because on the client, `getSession` is
   * safe, and on the server, it reads `session` from the `LayoutData`, which
   * safely checked the session using `safeGetSession`.
   */
  let {
    data: { session },
    error: getSessionError,
  } = await supabase.auth.getSession()
  let {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser()

  // Check if user has logged out or JWT validation has failed
  if (!session || !user || getSessionError || getUserError) {
    // Here user is considered signed out. Return an anonymous session.
    // See: https://supabase.com/docs/guides/auth/auth-anonymous?queryGroups=language&language=js
    await supabase.auth.signInAnonymously()
    session = (await supabase.auth.getSession()).data.session!
    user = (await supabase.auth.getUser()).data.user!
    if (!session.user.is_anonymous || !user.is_anonymous)
      throw new Error('Failed to create anonymous user and session')
  }

  return { supabase, session, user }
}

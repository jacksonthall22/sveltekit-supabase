import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

const supabase: Handle = async ({ event, resolve }) => {
  // console.log(`[HOOKS: supabase()] test: event.url.pathname: "${event.url.pathname}"`)

  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      }
    }
  })

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession()

    // console.log(
    //   `[HOOKS: supabase()] test: event.locals.safeGetSession() session: ${JSON.stringify(session)}`
    // )

    if (!session) {
      return { session: null, user: null }
    }

    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }

    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    }
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  // console.log(`[HOOKS: authGuard()] test: authGuard() event.url.pathname: "${event.url.pathname}"`)
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  // console.log(
  //   `[HOOKS] test: event.url.pathname: "${event.url.pathname}" session: ${JSON.stringify(session)}, user: ${JSON.stringify(user)}`
  // )

  if (!event.locals.session && event.url.pathname.startsWith('/private')) {
    redirect(303, '/auth')
  }

  // console.log(`[HOOKS] test: PASSED authGuard(), user: ${user}, session: ${session}`)

  if (event.locals.session && event.url.pathname === '/auth') {
    // console.log(`[HOOKS] test: authGuard() found session, redirecting to '/private'...`)
    redirect(303, '/private')
  }

  return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)

import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { DaisyUITheme } from '$lib/constants'
import {
  setTheme,
  SITE_SETTINGS_STORAGE_KEY,
  siteSettingsSchema,
} from '$lib/runes/siteSettings.svelte'
import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const supabase: Handle = async ({ event, resolve }) => {
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
      },
    },
  })

  /**
   * Creates an Admin Supabase client specific to this server request.
   *
   * Supabase provides both an `anon` key and a `service_role` key that are granted
   * different RLS (row-level security) policies for accessing the Postgres database.
   * The `event.locals.supabase` client should be used by default as it uses the `anon`
   * key that follows stricter RLS policies, but this `event.locals.supabaseAdmin` client
   * may be used for operations that require elevated privileges, such as deleting users.
   */
  event.locals.supabaseAdmin = createServerClient(
    PUBLIC_SUPABASE_URL,
    PRIVATE_SUPABASE_SERVICE_ROLE_KEY,
    {
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
        },
      },
    },
  )

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()

    if (!session) return { session: null, user: null }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()

    // Check if JWT validation has failed
    if (error) return { session: null, user: null }

    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  if (!event.locals.session && event.url.pathname.startsWith('/private')) redirect(303, '/auth')
  if (event.locals.session && event.url.pathname.startsWith('/auth/signIn'))
    redirect(303, '/private')

  return resolve(event)
}

/**
 * Apply site settings from cookies to the HTML response. Currently this handles
 * setting the saved DaisyUI theme, but could easily be extended to handle
 * reading/applying other site settings!
 */
const applySavedSiteSettings: Handle = async ({ event, resolve }) => {
  // Based on:
  // https://scottspence.com/posts/cookie-based-theme-selection-in-sveltekit-with-daisyui
  let parsedSiteSettings
  try {
    const savedSiteSettingsStr = event.cookies.get(SITE_SETTINGS_STORAGE_KEY)
    const savedSiteSettings = JSON.parse(savedSiteSettingsStr!)
    parsedSiteSettings = siteSettingsSchema.safeParse(savedSiteSettings)
  } catch (e) {
    return resolve(event)
  }
  if (!parsedSiteSettings.success) return resolve(event)

  // Apply theme
  const theme: DaisyUITheme = parsedSiteSettings.data.theme
  if (!theme || !(theme in DaisyUITheme)) return resolve(event)
  setTheme(theme)
  
  return resolve(event, {
    transformPageChunk({ html }) {
      return html.replace(`data-theme=""`, `data-theme="${theme}"`)
    },
  })
}

export const handle: Handle = sequence(supabase, authGuard, applySavedSiteSettings)

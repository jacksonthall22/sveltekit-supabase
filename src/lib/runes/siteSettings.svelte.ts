import { DAISYUI_DEFAULT_THEME, DaisyUITheme } from '$lib/constants'
import { persistedState } from 'svelte-persisted-state'
import { z } from 'zod'

export const SITE_SETTINGS_STORAGE_KEY = 'siteSettings'
export const siteSettingsSchema = z.object({
  theme: z.nativeEnum(DaisyUITheme),
})
export type SiteSettings = z.infer<typeof siteSettingsSchema>

/**
 * This is a wrapper around a reactive `$state()` that automatically persists its state to cookies.
 * We can use it to store site settings like the theme, which we want to persist across page reloads
 * and server-side rendering (SSR) without causing a Flash Of Unstyled Content (FOUC).
 */
export const siteSettings = persistedState<SiteSettings>(
  SITE_SETTINGS_STORAGE_KEY,
  {
    theme: DaisyUITheme.light,
  },
  {
    // Persisting in cookies means we can set the theme server-side from `+hooks.server.ts` to prevent FOUC!
    storage: 'cookie',
    syncTabs: true,
    beforeWrite: (value) => {
      return value
    },
    onWriteError: (error) => {
      console.error('Failed to save site settings:', error)
    },
  },
)

export const setTheme = (theme: DaisyUITheme) => {
  console.debug(`Setting theme to: ${theme}`)
  // Validate the theme against the schema
  const parsedTheme = siteSettingsSchema.shape.theme.safeParse(theme)
  if (!parsedTheme.success) {
    console.error(`Failed to parse saved theme: ${theme}`)
    siteSettings.current.theme = DAISYUI_DEFAULT_THEME
    return
  }
  siteSettings.current.theme = parsedTheme.data

  // Try setting the theme in the document element. When called from the server,
  // we don't have access to the document, so just skip this step.
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
}

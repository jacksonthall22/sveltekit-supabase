import { persistedState } from 'svelte-persisted-state'

interface SiteSettings {
  theme: 'light' | 'dark'
  notifications: boolean
}

export const siteSettings = persistedState<SiteSettings>(
  'siteSettings',
  {
    theme: 'light',
    notifications: true,
  },
  {
    storage: 'local',
    syncTabs: true,
    beforeWrite: (value) => {
      // console.log('test: Saving preferences:', $state.snapshot(value))
      return value
    },
    onWriteError: (error) => {
      console.error('Failed to save preferences:', error)
    },
  },
)

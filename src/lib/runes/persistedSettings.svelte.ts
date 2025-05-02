import { persistedState } from 'svelte-persisted-state'

interface SiteSettings {
  theme: 'light' | 'dark'
  fontSize: number
  notifications: boolean
}

export const siteSettings = persistedState<SiteSettings>(
  'siteSettings',
  {
    theme: 'light',
    fontSize: 16,
    notifications: true
  },
  {
    storage: 'local',
    syncTabs: true,
    beforeWrite: (value) => {
      console.log('Saving preferences:', value)
      return value
    },
    onWriteError: (error) => {
      console.error('Failed to save preferences:', error)
    }
  }
)

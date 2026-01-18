import { browser } from '$app/environment'
import { getSupabaseClient } from '$lib/supabaseClient'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends }) => {
  /**
   * Declare a dependency so the layout can be invalidated, for example, on
   * session refresh.
   */
  depends('supabase:auth')

  if (browser) {
    const supabase = getSupabaseClient()
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      return { session, user }
    }
  }

  return {
    session: data.session,
    user: data.user,
  }
}

import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends }) => {
  /**
   * Declare a dependency so the layout can be invalidated, for example, on
   * session refresh.
   */
  depends('supabase:auth')

  return {
    session: data.session,
    user: data.user,
  }
}

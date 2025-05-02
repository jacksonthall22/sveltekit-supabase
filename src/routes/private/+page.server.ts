import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
  depends('supabase:db:notes')
  const { data } = await supabase.from('profile').select('id,firstName,lastName,email').single()
  return { data }
}

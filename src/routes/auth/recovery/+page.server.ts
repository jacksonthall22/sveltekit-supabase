import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import { getOrCreateUserProfile } from '$lib/auth/index.server'
import { superValidate } from 'sveltekit-superforms/server'
import type { SuperValidated } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'

const formSchema = z.object({
  firstName: z.string().default(''),
  lastName: z.string().default(''),
  email: z.string().email().default(''),
})

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const userProfile = await getOrCreateUserProfile(locals)
  const form = await superValidate(userProfile, zod(formSchema))
  return { form }
}

export const actions = {
  resetPassword: async ({ request, locals }) => {
    const { supabase } = locals
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://example.com/update-password',
    })

    if (error) {
      console.error(`[AUTH +page.server.ts] error: ${error}`)
      return fail(400, { resetPasswordError: error })
    }

    // console.log(`[AUTH +page.server.ts] test: resetPassword() SUCCESS! redirecting to '/'...`)
    return { success: true }
  }
} satisfies Actions

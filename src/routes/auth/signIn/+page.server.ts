import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import type { PageServerLoad } from './$types'
import { z } from 'zod'
import type { SuperValidated } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms'
import { PUBLIC_USE_HCAPTCHA } from '$env/static/public'
import { MIN_PASSWORD_LENGTH } from '$lib/constants'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  hCaptchaToken: z.string().optional(),
})

export type SignInFormValidated = SuperValidated<z.infer<typeof schema>>

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(schema))
  return { form }
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(schema))
    if (!form.valid) return fail(400, { form })

    // Verify hCaptcha before proceeding
    if (PUBLIC_USE_HCAPTCHA && !form.data.hCaptchaToken)
      return setError(form, 'hCaptchaToken', 'hCaptcha verification failed')

    const { error } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password,
      options: PUBLIC_USE_HCAPTCHA ? { captchaToken: form.data.hCaptchaToken } : undefined,
    })

    if (error?.code === 'invalid_credentials')
      return setError(form, '', 'Invalid email or password')

    if (error) return fail(500, { form })

    redirect(303, '/')
  },
} satisfies Actions

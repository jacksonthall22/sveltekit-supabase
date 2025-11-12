import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import type { PageServerLoad } from './$types'
import { z } from 'zod'
import type { SuperValidated } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms'
import { PUBLIC_USE_HCAPTCHA } from '$env/static/public'

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  hcaptchaToken: z.string(),
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

    const { error } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password,
      options:
        PUBLIC_USE_HCAPTCHA ?
          {
            captchaToken: form.data.hcaptchaToken,
          }
        : {},
    })

    if (error) {
      if (error.code === 'invalid_credentials')
        return setError(form, 'Invalid email or password', { status: 401 })

      if (error.code == 'captcha_failed')
        return setError(form, 'hCaptcha verification failed', { status: 422 })

      setError(form, `Unexpected error: ${error.code}`, { status: 500 })
      return fail(500, { form })
    }

    redirect(303, '/')
  },
} satisfies Actions

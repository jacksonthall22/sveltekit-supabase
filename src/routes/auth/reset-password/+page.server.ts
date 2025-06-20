import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import type { PageServerLoad } from './$types'
import { z } from 'zod'
import type { SuperValidated } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message, setError, superValidate } from 'sveltekit-superforms'
import { PUBLIC_USE_HCAPTCHA } from '$env/static/public'
import { MIN_PASSWORD_LENGTH } from '$lib/constants'
import { route } from '$lib/ROUTES'

const schema = z.object({
  password: z.string().min(MIN_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH),
  hCaptchaToken: z.string().optional(),
})

export type ResetPasswordFormValidated = SuperValidated<z.infer<typeof schema>>

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = locals
  if (!user) redirect(302, route('/auth/recovery'))
  const form = await superValidate(zod(schema))
  return { form }
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(schema))
    if (!form.valid) return fail(400, { form })

    if (form.data.password !== form.data.confirmPassword)
      return setError(form, 'confirmPassword', 'Passwords do not match')

    // Verify hCaptcha before proceeding
    if (PUBLIC_USE_HCAPTCHA && !form.data.hCaptchaToken)
      return setError(form, 'hCaptchaToken', 'hCaptcha verification failed')

    const { error } = await supabase.auth.updateUser({ password: form.data.password })

    if (error) {
      if (error?.code === 'same_password')
        return setError(form, '', 'New password cannot be the same as the old password')
      return fail(500, { form, error })
    }

    return message(form, 'Password updated!')
  },
} satisfies Actions

import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import type { PageServerLoad } from '../$types'
import { z } from 'zod'
import type { SuperValidated } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms'
import type { H_CAPTCHA_TOKEN_INPUT_NAME } from '$lib/constants'

const signUpFormSchema = z.object({
  firstName: z.string().default(''),
  lastName: z.string().default(''),
  email: z.string().email().default(''),
  password: z.string().min(8).default(''),
  hCaptchaToken: z.string().default('')
})

const signInFormSchema = z.object({
  email: z.string().email().default(''),
  password: z.string().min(6).default(''),
  hCaptchaToken: z.string()
})

export type SignUpFormValidated = SuperValidated<z.infer<typeof signUpFormSchema>>
export type SignInFormValidated = SuperValidated<z.infer<typeof signInFormSchema>>

export const load: PageServerLoad = async () => {
  const signUpForm = await superValidate({}, zod(signUpFormSchema))
  const signInForm = await superValidate({}, zod(signInFormSchema))

  return { signInForm, signUpForm }
}

export const actions: Actions = {
  signUp: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(signUpFormSchema))
    if (!form.valid) return fail(400, { error: 'Invalid form data', form })

    const formData = await request.formData()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const hcaptchaToken = formData.get('h-captcha-response') as string | null

    // Verify hCaptcha before proceeding
    if (!hcaptchaToken) return fail(400, { error: 'Missing hCaptcha token', form })

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { captchaToken: hcaptchaToken }
    })
    if (error) return fail(400, { signUpError: error, form })

    return { success: true }
  },

  signIn: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(signInFormSchema))
    if (!form.valid) return fail(400, { error: 'Invalid form data', form })
    
    // Verify hCaptcha before proceeding
    if (!form.data.hCaptchaToken) return fail(400, { error: 'Missing hCaptcha token', form })

    const { error } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password,
      options: { captchaToken: form.data.hCaptchaToken }
    })

    if (error) return fail(401, { error: 'Invalid credentials', form })

    console.log('test: signIn action. redirecting to /')

    return redirect(303, '/')
  }
}

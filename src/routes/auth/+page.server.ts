import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    // console.log(`[AUTH +page.server.ts] test: signup() formData: ${JSON.stringify(formData)}`)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const hcaptchaToken = formData.get('h-captcha-response') as string | null

    // Verify hCaptcha before proceeding
    if (!hcaptchaToken) {
      // console.error('test: Missing hCaptcha token')
      return fail(400, { hcaptchaResponse: 'Missing hCaptcha token' })
    } else {
      // console.log(`[AUTH +page.server.ts] test: signup() hcaptchaToken: ${hcaptchaToken}`)
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { captchaToken: hcaptchaToken }
    })
    // console.log(`[AUTH +page.server.ts] test: signup() error: ${error}`)

    if (error) {
      // console.error(`[AUTH +page.server.ts] error: ${error}`)
      return fail(400, { signUpError: error })
    }
    
    // console.log(`[AUTH +page.server.ts] test: signup() SUCCESS! redirecting to '/'...`)
    return { success: true }
  },
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    // console.log(`[AUTH +page.server.ts] test: login() formData: ${JSON.stringify(formData)}`)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const hcaptchaToken = formData.get('h-captcha-response') as string | null

    // Verify hCaptcha before proceeding
    if (!hcaptchaToken) {
      console.error('Missing hCaptcha token')
      return redirect(303, '/auth/error')
    }

    // console.log(`[AUTH +page.server.ts] test: login() email: ${email}, password: ${password}`)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: hcaptchaToken
      }
    })

    // console.log(`[AUTH +page.server.ts] test: login() error: ${error}`)
    if (error) {
      console.error(error)
      return redirect(303, '/auth/error')
    } else {
      return redirect(303, '/private')
    }
  }
}

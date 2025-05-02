import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'
import { PRIVATE_HCAPTCHA_SECRET_KEY } from '$env/static/private'

export const ssr = false;

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
      return redirect(303, '/auth/error')
    } else {
      // console.log(`[AUTH +page.server.ts] test: signup() hcaptchaToken: ${hcaptchaToken}`)
    }

    // const verifyRes = await fetch('https://hcaptcha.com/siteverify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     secret: PRIVATE_HCAPTCHA_SECRET_KEY,
    //     response: hcaptchaToken
    //   })
    // })
    // const verifyData = await verifyRes.json()
    // console.log(
    //   `[AUTH +page.server.ts] test: hcaptcha response JSON: ${JSON.stringify(verifyData)}`
    // )
    // if (!verifyData.success) {
    //   console.error('hCaptcha verification failed', verifyData)
    //   return redirect(303, '/auth/error')
    // }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { captchaToken: hcaptchaToken }
    })
    // console.log(`[AUTH +page.server.ts] test: signup() error: ${error}`)

    if (error) {
      // console.error(`[AUTH +page.server.ts] error: ${error}`)
      return redirect(303, '/auth/error')
    } else {
      // console.log(`[AUTH +page.server.ts] test: signup() SUCCESS! redirecting to '/'...`)
      return redirect(303, '/')
    }
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

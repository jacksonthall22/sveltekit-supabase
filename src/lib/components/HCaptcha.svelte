<script lang="ts">
  import { PUBLIC_HCAPTCHA_SITE_KEY } from '$env/static/public'
  import { H_CAPTCHA_ELEMENT_ID, H_CAPTCHA_TOKEN_INPUT_NAME } from '$lib/constants'
  import { onMount } from 'svelte'

  let token = $state(undefined)

  onMount(() => {
    window.hcaptcha.render(H_CAPTCHA_ELEMENT_ID, {
      sitekey: PUBLIC_HCAPTCHA_SITE_KEY,
      callback: (response) => {
        console.log('test: hCaptcha response:', response)
        token = response
      }
    })
  })
</script>

<svelte:head>
  <script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

<div class="mt-4 w-full">
  <div id={H_CAPTCHA_ELEMENT_ID} class="h-captcha"></div>
  <input type="hidden" name={H_CAPTCHA_TOKEN_INPUT_NAME} value={token} />
</div>

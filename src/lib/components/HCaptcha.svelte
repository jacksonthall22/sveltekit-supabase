<script lang="ts">
  import { PUBLIC_HCAPTCHA_SITE_KEY, PUBLIC_USE_HCAPTCHA } from '$env/static/public'
  import { H_CAPTCHA_ELEMENT_ID, H_CAPTCHA_TOKEN_INPUT_NAME } from '$lib/constants'
  import { onMount } from 'svelte'

  interface Props {
    token: string
  }
  let { token = $bindable() }: Props = $props()

  onMount(() => {
    if (!PUBLIC_USE_HCAPTCHA) return

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
  <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
</svelte:head>

{#if PUBLIC_USE_HCAPTCHA}
  <div class="mt-4 w-full">
    <div class="h-captcha" data-sitekey={PUBLIC_HCAPTCHA_SITE_KEY}></div>
    <input type="hidden" />
  </div>
{/if}

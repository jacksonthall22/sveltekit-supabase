<script lang="ts">
  import { onMount } from 'svelte'
  import { PUBLIC_HCAPTCHA_SITE_KEY } from '$env/static/public'

  type Props = {
    token?: string | null
    onVerify?: (token: string) => void
    onExpired?: () => void
    onError?: () => void
  }

  let { token = $bindable<string | null>(null), onVerify, onExpired, onError }: Props = $props()

  let container: HTMLDivElement | null = null
  let widgetId = $state<string | null>(null)

  function loadScript(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve()
    if ((window as any).hcaptcha) return Promise.resolve()

    return new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-hcaptcha]')
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(new Error('hCaptcha failed to load')), {
          once: true,
        })
        return
      }

      ;(window as any).hcaptchaOnLoad = () => {
        resolve()
      }

      const script = document.createElement('script')
      script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=hcaptchaOnLoad'
      script.async = true
      script.defer = true
      script.dataset.hcaptcha = 'true'
      script.onerror = () => reject(new Error('hCaptcha failed to load'))
      document.head.appendChild(script)
    })
  }

  function renderWidget() {
    if (!container) return
    if (!(window as any).hcaptcha) return
    if (widgetId !== null) return

    widgetId = (window as any).hcaptcha.render(container, {
      sitekey: PUBLIC_HCAPTCHA_SITE_KEY,
      callback: (t: string) => {
        token = t
        onVerify?.(t)
      },
      'expired-callback': () => {
        token = null
        onExpired?.()
      },
      'error-callback': () => {
        token = null
        onError?.()
      },
    })
  }

  onMount(() => {
    let destroyed = false

    loadScript()
      .then(() => {
        if (!destroyed) renderWidget()
      })
      .catch((err) => {
        console.error('hCaptcha script load error:', err)
      })

    return () => {
      destroyed = true
      reset()
    }
  })

  /** Exposed method */
  export function reset() {
    if (widgetId !== null && (window as any).hcaptcha) {
      ;(window as any).hcaptcha.reset(widgetId)
      token = null
    }
  }
</script>

<div bind:this={container}></div>

<style lang="postcss">
  @global iframe {
    width: 100% !important;
  }
</style>

<script lang="ts">
  import { PUBLIC_HCAPTCHA_SITE_KEY } from '$env/static/public'
</script>

<svelte:head>
  <script
    src="https://js.hcaptcha.com/1/api.js?render=explicit&onload=onLoad&custom=true"
    async
    defer
  ></script>
  <script>
    var onLoad = function () {
      const root = document.documentElement
      const cs = getComputedStyle(root)
      // detect light vs. dark (DaisyUI sets data-theme="dark")
      const mode = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
      const getVar = (name) => cs.getPropertyValue(name).trim();

      // Just for fun, try to set all DaisyUI colors in the hCaptcha theme (doesn't seem to work though)
      const theme = {
        palette: {
          mode,
          // DaisyUI base greys
          grey: {
            100: getVar('--color-base-100'),
            200: getVar('--color-base-200'),
            300: getVar('--color-base-300'),
            400: getVar('--color-base-300'),
            500: getVar('--color-neutral'),
            600: getVar('--color-neutral'),
            700: getVar('--color-neutral'),
            800: getVar('--color-neutral'),
            900: getVar('--color-base-content'),
            1000: getVar('--color-base-content')
          },
          // your brand colors
          primary: { main: getVar('--color-primary') },
          warn: { main: getVar('--color-warning') },
          text: {
            heading: getVar('--color-base-content'),
            body: getVar('--color-base-content')
          }
        },

        component: {
          checkbox: {
            main: { fill: getVar('--color-base-100'), border: getVar('--color-base-200') },
            hover: { fill: getVar('--color-base-200') }
          },
          challenge: {
            main: { fill: getVar('--color-base-100'), border: getVar('--color-base-200') },
            hover: { fill: getVar('--color-base-100') }
          },
          modal: {
            main: { fill: getVar('--color-base-100') },
            hover: { fill: getVar('--color-base-200') },
            focus: { outline: getVar('--color-primary') }
          },
          breadcrumb: {
            main: { fill: getVar('--color-base-200') },
            active: { fill: getVar('--color-secondary') },
            hover: {
              fill: getVar('--color-secondary'),
              border: getVar('--color-secondary'),
              text: getVar('--color-secondary-content')
            },
            focus: { outline: getVar('--color-primary') }
          },
          button: {
            main: {
              fill: getVar('--color-base-100'),
              icon: getVar('--color-base-content'),
              text: getVar('--color-base-content')
            },
            hover: { fill: getVar('--color-base-200') },
            focus: {
              icon: getVar('--color-primary'),
              text: getVar('--color-primary'),
              outline: getVar('--color-primary')
            },
            active: {
              fill: getVar('--color-base-200'),
              icon: getVar('--color-base-content'),
              text: getVar('--color-base-content')
            }
          },
          link: { focus: { outline: getVar('--color-primary') } },
          list: { main: { fill: getVar('--color-base-100'), border: getVar('--color-base-200') } },
          listItem: {
            main: {
              fill: getVar('--color-base-100'),
              line: getVar('--color-base-200'),
              text: getVar('--color-base-content')
            },
            hover: { fill: getVar('--color-base-200') },
            selected: { fill: getVar('--color-base-300') },
            focus: { outline: getVar('--color-primary') }
          },
          input: {
            main: { fill: getVar('--color-base-100'), border: getVar('--color-base-content') },
            focus: {
              fill: getVar('--color-base-200'),
              border: getVar('--color-base-content'),
              outline: getVar('--color-primary')
            }
          },
          radio: {
            main: {
              fill: getVar('--color-base-200'),
              border: getVar('--color-base-content'),
              check: getVar('--color-base-100')
            },
            selected: { check: getVar('--color-primary') },
            focus: { outline: getVar('--color-primary') }
          },
          task: {
            main: { fill: getVar('--color-base-200') },
            selected: { badge: getVar('--color-primary'), outline: getVar('--color-primary') },
            report: { badge: getVar('--color-error'), outline: getVar('--color-error') },
            focus: { badge: getVar('--color-primary'), outline: getVar('--color-primary') }
          },
          prompt: {
            main: {
              fill: getVar('--color-primary'),
              border: getVar('--color-primary'),
              text: getVar('--color-primary-content')
            },
            report: {
              fill: getVar('--color-error'),
              border: getVar('--color-error'),
              text: getVar('--color-error-content')
            }
          },
          skipButton: {
            main: {
              fill: getVar('--color-neutral'),
              border: getVar('--color-neutral'),
              text: getVar('--color-neutral-content')
            },
            hover: {
              fill: getVar('--color-neutral'),
              border: getVar('--color-neutral'),
              text: getVar('--color-neutral-content')
            },
            focus: { outline: getVar('--color-primary') }
          },
          verifyButton: {
            main: {
              fill: getVar('--color-primary'),
              border: getVar('--color-primary'),
              text: getVar('--color-primary-content')
            },
            hover: {
              fill: getVar('--color-primary'),
              border: getVar('--color-primary'),
              text: getVar('--color-primary-content')
            },
            focus: { outline: getVar('--color-primary') }
          },
          slider: {
            main: { bar: getVar('--color-base-200'), handle: getVar('--color-primary') },
            focus: { handle: getVar('--color-primary') }
          },
          textarea: {
            main: { fill: getVar('--color-base-200'), border: getVar('--color-base-content') },
            focus: { fill: getVar('--color-base-200'), outline: getVar('--color-primary') },
            disabled: { fill: getVar('--color-base-200') }
          }
        }
      }
      hcaptcha.render('h-captcha', {
        sitekey: '60f07474-a784-46fa-b92a-7b481aea16de',
        theme
      })
    }
  </script>
</svelte:head>

<form
  method="POST"
  action="?/login"
  class="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow space-y-6"
>
  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
    Email
    <input
      name="email"
      type="email"
      class="mt-1 block w-full rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </label>
  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
    Password
    <input
      name="password"
      type="password"
      class="mt-1 block w-full rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </label>
  <div class="mt-4 w-full">
    <div
      id="h-captcha"
      class="h-captcha"
      data-sitekey={PUBLIC_HCAPTCHA_SITE_KEY}
    ></div>
  </div>
  <div class="flex gap-4">
    <button
      type="submit"
      class="flex-1 bg-primary text-primary-foreground font-semibold py-2 px-4 rounded hover:bg-primary/90 transition-colors"
      >Login</button
    >
    <button
      type="submit"
      formaction="?/signup"
      class="flex-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold py-2 px-4 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
      >Sign up</button
    >
  </div>
</form>

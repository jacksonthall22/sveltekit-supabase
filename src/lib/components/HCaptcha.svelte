<script lang="ts">
  import { PUBLIC_HCAPTCHA_SITE_KEY } from '$env/static/public'
  import { H_CAPTCHA_ELEMENT_ID } from '$lib/constants'
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
      const getVar = (name) => cs.getPropertyValue(name).trim()

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
        sitekey: '10000000-ffff-ffff-ffff-000000000001',
        theme
      })
    }
  </script>
</svelte:head>

<div class="mt-4 w-full">
  <div id={H_CAPTCHA_ELEMENT_ID} class="h-captcha" data-sitekey={PUBLIC_HCAPTCHA_SITE_KEY}></div>
</div>

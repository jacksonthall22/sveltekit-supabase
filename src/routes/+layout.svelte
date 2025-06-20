<script>
  import { invalidate } from '$app/navigation'
  import { page } from '$app/state'
  import SignInButton from '$lib/components/SignInButton.svelte'
  import ThemeController from '$lib/components/ThemeController.svelte'
  import Toaster from '$lib/components/Toaster.svelte'
  import { route } from '$lib/ROUTES'
  import { onMount } from 'svelte'
  import '../app.css'

  const { data, children } = $props()
  const { supabase, session } = $derived(data)

  let breadcrumbs = $derived.by(() => {
    const { pathname } = page.url
    const path = pathname.split('/').filter(Boolean)
    return path.map((p, i) => ({
      name: p,
      href: '/' + path.slice(0, i + 1).join('/'),
      title: p.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    }))
  })

  // https://supabase.com/docs/guides/auth/server-side/sveltekit
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) invalidate('supabase:auth')

      if (event === 'INITIAL_SESSION') {
        // handle initial session
      } else if (event === 'SIGNED_IN') {
        // handle sign in event
      } else if (event === 'SIGNED_OUT') {
        // handle sign out event
      } else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      } else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (event === 'USER_UPDATED') {
        // handle user updated event
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

<div class="flex min-h-screen flex-col">
  <div class="flex flex-col [&>*]:p-2">
    <nav class="border-b">
      <div class="mx-auto flex w-full max-w-2xl items-center justify-between">
        <a href={route('/')} class="text-2xl font-bold">App</a>

        <div class="flex gap-2">
          {#if !page.url.pathname.includes('signIn')}
            <SignInButton />
          {/if}
          <ThemeController />
        </div>
      </div>
    </nav>

    <nav>
      <div class="breadcrumbs mx-auto w-full max-w-2xl text-sm">
        <ul>
          <li><a href={route('/')}>Home</a></li>
          {#each breadcrumbs as crumb}
            <li>
              {#if crumb.href}
                <a href={crumb.href}>{crumb.title}</a>
              {:else}
                {crumb.title}
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    </nav>
  </div>

  <main class="mx-auto w-full max-w-2xl flex-grow px-2 py-5 md:px-0">
    {@render children()}
  </main>

  <footer class="w-full border-t py-5">
    <div class="mx-auto flex w-full max-w-2xl items-center justify-center">
      <a href={route('engageintellectGithub')} class="text-sm">@engageintellect</a>
      <a href={route('jacksonLinkedin')} class="ml-2 text-sm">@jacksonthall22</a>
    </div>
  </footer>

  <Toaster />
</div>

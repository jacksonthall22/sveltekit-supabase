<script>
  import '../app.css'
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import ThemeController from '$lib/components/ThemeController.svelte'
  
  // Log the current page route whenever it changes
  import { page } from '$app/state'

  let breadcrumbs = $derived.by(() => {
    const { pathname } = page.url
    const path = pathname.split('/').filter(Boolean)
    return path.map((p, i) => ({
      name: p,
      href: '/' + path.slice(0, i + 1).join('/'),
      title: p.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    }))
  })

  const { data, children } = $props()
  const { supabase, session } = $derived(data)

  // https://supabase.com/docs/guides/auth/server-side/sveltekit
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('test:', event, session)
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
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

    return () => {
      data.subscription.unsubscribe()
    }
  })
</script>

<div class="flex min-h-screen flex-col">
  <nav class="border-b p-2">
    <div class="mx-auto flex w-full max-w-2xl items-center justify-between">
      <a href="/" class="text-2xl font-bold">App</a>

      <div class="flex gap-2">
        {#if session !== null}
          <button class="btn btn-error">
            <a href="/auth/logout">logout</a>
          </button>
        {/if}
        <ThemeController />
      </div>
    </div>
  </nav>

  <div class="breadcrumbs w-full max-w-2xl mx-auto text-sm">
    <ul>
      <li><a href="/">Home</a></li>
      {#each breadcrumbs as crumb}
        <li>
          {#if crumb.href}
            <a href="{crumb.href}">{crumb.title}</a>
          {:else}
            {crumb.title}
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  <main class="mx-auto w-full max-w-2xl flex-grow px-2 py-5 md:px-0">
    {@render children()}
  </main>

  <footer class="w-full border-t py-5">
    <div class="mx-auto flex w-full max-w-2xl items-center justify-center">
      <a href="https://github.com/engageintellect" class="text-sm">@engageintellect</a>
      <a href="https://linkedin.com/in/jackson-t-hall" class="text-sm ml-2">@jacksonthall22</a>
    </div>
  </footer>
</div>

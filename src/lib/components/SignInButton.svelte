<script lang="ts">
  import { superForm } from 'sveltekit-superforms'
  import type { Session } from '@supabase/supabase-js'

  interface Props {
    session: Session | null
  }
  let { session }: Props = $props()

  $inspect('session', session)

  let { delayed, submitting, enhance } = superForm({})
</script>

{#if session}
  <form method="POST" action="/auth/signOut" use:enhance>
    <button class="btn" type="submit" disabled={$delayed || $submitting}>
      {#if $delayed}
        <span class="loading loading-dots loading-sm"></span>
      {:else}
        Sign out
      {/if}
    </button>
  </form>
{:else}
  <a class="btn" href="/auth/signIn"> Sign in </a>
{/if}

<script lang="ts">
  import { superForm } from 'sveltekit-superforms'
  import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

  interface Props {
    session: Session | null
  }
  let { session }: Props = $props()

  let { form, delayed, submitting, enhance } = superForm({})
</script>

<form method="POST" action="/auth/logout?" use:enhance>
  <button class="btn" type="submit" disabled={$delayed || $submitting}>
    {#if $delayed}
      <span class="loading loading-spinner loading-sm"></span>
    {:else}
      Sign out
    {/if}
  </button>
</form>

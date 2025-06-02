<script lang="ts">
  import { page } from '$app/state'
  import { route } from '$lib/ROUTES'
  import { superForm } from 'sveltekit-superforms'

  let { delayed, submitting, enhance } = superForm({})
</script>

{#if page.data.session}
  <form method="POST" action={route('default /auth/signOut')} use:enhance>
    <button type="submit" class="btn" disabled={$delayed || $submitting}>
      {#if $delayed}
        <span class="loading loading-dots loading-sm"></span>
      {:else}
        Sign out
      {/if}
    </button>
  </form>
{:else}
  <a class="btn" href={route('/auth/signIn')}> Sign in </a>
{/if}

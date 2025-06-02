<script lang="ts">
  import { page } from '$app/state'
  import { superForm } from 'sveltekit-superforms'
  import { route } from '$lib/ROUTES'

  let user = $derived(page.data.session ? page.data.session.user : null)

  let { submitting, delayed, enhance } = superForm({})
</script>

<form
  method="POST"
  action={route('default /auth/deleteAccount')}
  use:enhance={{
    onSubmit: ({ cancel }) => {
      if (!confirm('Are you sure you want to delete your account? This action cannot be undone.'))
        cancel()
    },
  }}
>
  <button type="submit" class="btn btn-block btn-error" disabled={!user || $submitting}>
    {#if $delayed}
      <span class="loading loading-dots loading-sm"></span>
    {:else}
      Delete account
    {/if}
  </button>
</form>

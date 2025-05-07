<script lang="ts">
  import UpdateProfile from '$lib/components/UpdateProfile.svelte'
  import Icon from '@iconify/svelte'

  let { data } = $props()
  let user = $derived(data.user)
</script>

{#if user}
  <UpdateProfile form={data.form} />
{:else}
  <div class="hero min-h-72 ring-1">
    <div class='hero-content flex-col'>
      <div class="flex items-center justify-center gap-2">
        <Icon icon="logos:svelte-icon" class="h-24 w-24" />
        <div>+</div>
        <Icon icon="logos:supabase-icon" class="h-24 w-24" />
      </div>
      <a href='/auth' class='btn btn-lg btn-block'>Login</a>
    </div>
  </div>
{/if}

<script lang="ts">
  import { route } from '$lib/ROUTES.js'
  import Icon from '@iconify/svelte'
</script>

<div class="hero min-h-72 ring-1">
  <div class="hero-content flex-col">
    <div class="flex items-center justify-center gap-2">
      <Icon icon="logos:svelte-icon" class="h-24 w-24" />
      <div>+</div>
      <Icon icon="logos:supabase-icon" class="h-24 w-24" />
    </div>
    <a href={route('/auth/signIn')} class="btn btn-lg btn-block">Login</a>
  </div>
</div>

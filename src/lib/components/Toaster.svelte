<!-- src/lib/components/Toaster.svelte -->
<script lang="ts">
  import { toaster } from '$lib/runes/toaster.svelte'
  import Toast from './Toast.svelte'
</script>

<div class="toast items-end">
  {#each toaster.items as toast (toast.id)}
    <Toast {toast} />
  {/each}
</div>

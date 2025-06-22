<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div class="card card-border mx-auto w-sm shadow-sm">
  {@render children()}
</div>

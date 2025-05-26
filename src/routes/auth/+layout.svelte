<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { LayoutData } from './$types'

  let { children }: { data: LayoutData; children: Snippet } = $props()
</script>

<div class="card card-border mx-auto w-sm shadow-sm">
  {@render children()}
</div>

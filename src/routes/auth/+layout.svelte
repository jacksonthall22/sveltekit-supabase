<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { LayoutData } from './(cardLayout)/$types'

  let { data, children }: { data: LayoutData; children: Snippet } = $props()
</script>

<div class="card card-border mx-auto w-sm shadow-sm">
  {@render children()}
</div>

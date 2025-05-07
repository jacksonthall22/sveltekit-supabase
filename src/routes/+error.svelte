<script lang="ts">
  import { page } from '$app/state'
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content text-center">
    <div class="flex max-w-md flex-col gap-2">
      <h1 class="mb-3 text-5xl font-bold">Oops!</h1>
      <code>{page.status}: {page.error?.message}</code>
      <p>Something went wrong. Please try again later.</p>
    </div>
  </div>
</div>

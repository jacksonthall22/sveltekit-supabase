<script lang="ts">
  let { data } = $props()
</script>

<div class="w-full">
  <p>
    If you're seeing this page, it means the <code>+hooks.server.ts</code>
    <code>authGuard()</code> function passed. This route is inaccessible when logged out.
  </p>

  <h1 class="my-2 mt-6 text-2xl font-bold">
    <code>Page Data</code>
  </h1>
  <p class="scroll-x-auto bg-base-200 overflow-x-scroll p-2">
    <code class="w-full overflow-hidden overflow-y-scroll whitespace-pre">
      {JSON.stringify(data, undefined, 2)}
    </code>
  </p>
</div>

<script lang="ts">
  let { data } = $props()
</script>

<div class="w-full">
  <p>
    If you're seeing this page, it means the <code>+hooks.server.ts</code>
    <code>authGuard()</code> function passed. This route is inaccessible when logged out.
  </p>
  
  <h1 class='text-2xl font-bold mt-6 my-2'>
    <code>Page Data</code>
  </h1>
  <p class='overflow-x-scroll scroll-x-auto bg-base-200 p-2'>
    <code class="w-full whitespace-pre overflow-y-scroll overflow-hidden">
      {JSON.stringify(data, undefined, 2)}
    </code>
  </p>
</div>

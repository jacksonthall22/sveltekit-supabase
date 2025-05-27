<script lang="ts">
  let { data } = $props()
</script>

<div class="card">
  <div class="card-body">
    <p>
      If you're seeing this page, it means the <code>+hooks.server.ts</code>
      <code>authGuard()</code> function passed. This route is inaccessible when logged out.
    </p>
    <code class="card-title">page data:</code>
    <code class="whitespace-pre">{JSON.stringify(data, undefined, 2)}</code>
  </div>
</div>

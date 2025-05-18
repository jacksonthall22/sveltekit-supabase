<script lang="ts">
  let { data } = $props()
</script>

<div class="card">
  <div class=" card-title">Private page for user 😏</div>
  <div class="card-body">
    <code class="whitespace-pre">{JSON.stringify(data, undefined, 2)}</code>
  </div>
</div>

<script lang="ts">
  import type { Toast } from '$lib/runes/toaster.svelte'
  import { toaster } from '$lib/runes/toaster.svelte'
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'
  import { Tween } from 'svelte/motion'

  interface Props {
    toast: Toast
  }
  let { toast }: Props = $props()

  let alertType = $derived(
    toast.type === 'info' ? 'alert-info'
    : toast.type === 'success' ? 'alert-success'
    : 'alert-error',
  )

  let currentTime = new Tween(toast.durationMs, {
    duration: toast.durationMs,
  })
  onMount(() => {
    if (toast.durationMs === Infinity) return
    currentTime.target = 0
  })
</script>

<div class="alert {alertType} flex w-fit pr-2.5">
  <div class="flex flex-col">
    <div class="flex items-baseline justify-end gap-2">
      <span>{toast.message}</span>
      <button class="btn btn-xs btn-ghost h-6 w-6 p-0" onclick={() => toaster.remove(toast.id)}>
        <Icon icon="ic:close" />
      </button>
    </div>

    {#if toast.durationMs !== Infinity}
      <progress class="progress w-full" value={currentTime.current} max={toast.durationMs}
      ></progress>
    {/if}
  </div>
</div>

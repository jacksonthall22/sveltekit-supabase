<script lang="ts">
  import type { Toast } from '$lib/runes/toaster.svelte'
  import { toaster, ToastType } from '$lib/runes/toaster.svelte'
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'
  import { Tween } from 'svelte/motion'

  interface Props {
    toast: Toast
  }
  let { toast }: Props = $props()

  let alertType = $derived.by(() => {
    if (toast.type === ToastType.Info) return 'alert-info'
    if (toast.type === ToastType.Success) return 'alert-success'
    if (toast.type === ToastType.Error) return 'alert-error'
    console.warn(`Unknown toast type: ${toast.type}. Defaulting to 'alert-info'.`)
    return 'alert-info'
  })

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

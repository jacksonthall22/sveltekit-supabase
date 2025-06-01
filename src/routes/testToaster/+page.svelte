<script lang="ts">
  import { Toast, toaster } from '$lib/runes/toaster.svelte'
  import Toaster from '$lib/components/Toaster.svelte'

  let newToastMsg = $state('')
  let duration: number = $state(5000)
  let toastType: 'info' | 'success' | 'error' = $state('info')

  $inspect(toastType)
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    toaster.push(new Toast(newToastMsg, toastType, duration < 10000 ? duration : Infinity))
    newToastMsg = ''
  }}
>
  <input class="input" placeholder="Enter a toast message..." bind:value={newToastMsg} />

  <div class="my-4 w-full max-w-xs">
    <input type="range" min="0" max="10000" step="500" bind:value={duration} class="range" />
    <div class="mt-2 flex justify-between px-1 text-xs">
      {#each [0, 2, 4, 6, 8, 10] as i}
        <div class="flex w-4 flex-col text-center">
          <span>|</span>
          <span>{i}</span>
        </div>
      {/each}
    </div>
    <div class="my-2">
      Duration: {duration < 10000 ? `${duration} ms` : '∞'}
    </div>
  </div>

  <div class="my-4">
    <input
      type="radio"
      value="info"
      bind:group={toastType}
      name="toastType"
      class="radio"
      checked
    />
    Info
    <input type="radio" value="success" bind:group={toastType} name="toastType" class="radio" />
    Success
    <input type="radio" value="error" bind:group={toastType} name="toastType" class="radio" /> Error
  </div>

  <button type="submit" class="btn btn-primary" disabled={!newToastMsg}>Add toast</button>
</form>

<Toaster />

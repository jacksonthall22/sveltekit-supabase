<script lang="ts">
  import { route } from '$lib/ROUTES.js'
  import { Toast, toaster, ToastType } from '$lib/runes/toaster.svelte.js'
  import { untrack } from 'svelte'
  import { superForm } from 'sveltekit-superforms'

  let { data } = $props()
  let { form, errors, constraints, message, submitting, delayed, enhance } = $derived(
    superForm(data.form, {
      // These options allow form to be submitted multiple times and prevent page's `load()` function
      // from re-running. The form disappears after a successful submission if these are not set.
      invalidateAll: false,
      resetForm: true,
    }),
  )
  const anyErrors = $derived(Object.keys($errors).length > 0)

  $effect(() => {
    // Show new toast popup when `message` changes
    if ($message)
      untrack(() => {
        let toastType: ToastType
        if (anyErrors) toastType = ToastType.Error
        else toastType = ToastType.Info
        toaster.push(new Toast($message, toastType, 5000))
      })
  })
</script>

<form method="POST" class="card-body" use:enhance>
  <fieldset class="fieldset py-4">
    <legend class="fieldset-legend text-lg">Reset password</legend>

    <label for="password" class="floating-label">
      <span>New password</span>
      <input
        type="password"
        name="password"
        placeholder="Enter your new password"
        class="input input-md"
        bind:value={$form.password}
        aria-invalid={$errors.password ? 'true' : undefined}
        {...$constraints.password}
        required
      />
    </label>
    {#if $errors.password}
      <div class="text-error">{$errors.password}</div>
    {/if}

    <label for="confirmPassword" class="floating-label">
      <span>Confirm password</span>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm your new password"
        class="input"
        bind:value={$form.confirmPassword}
        aria-invalid={$errors.confirmPassword ? 'true' : undefined}
        {...$constraints.confirmPassword}
        required
      />
    </label>
    {#if $errors.confirmPassword}
      <div class="text-error">{$errors.confirmPassword}</div>
    {/if}
  </fieldset>
  {#if $errors._errors}
    <div class="text-error">{$errors._errors}</div>
  {/if}

  <div class="card-actions">
    <button type="submit" class="btn btn-primary" disabled={$submitting}>
      {#if $delayed}
        <div class="loading loading-dots loading-sm"></div>
      {:else}
        Reset password
      {/if}
    </button>
  </div>
</form>

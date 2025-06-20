<script lang="ts">
  import DeleteAccountButton from '$lib/components/DeleteAccountButton.svelte'
  import { route } from '$lib/ROUTES.js'
  import { Toast, toaster, ToastType } from '$lib/runes/toaster.svelte.js'
  import { untrack } from 'svelte'
  import SuperDebug, { superForm } from 'sveltekit-superforms'

  let { data } = $props()

  let user = $derived(data.user)!

  const { form, errors, constraints, message, submitting, delayed, enhance } = $derived(
    superForm(data.form, {
      // These options allow form to be submitted multiple times and prevent page's `load()` function
      // from re-running. The form disappears after a successful submission if these are not set.
      invalidateAll: false,
      resetForm: false,
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

<div class="flex flex-col gap-4 [&>*]:mx-auto [&>*]:w-xs">
  <form method="post" use:enhance class="card rounded-box border-base-300 border">
    <div class="card-body">
      <fieldset class="fieldset">
        <legend class="fieldset-legend text-lg">Profile</legend>

        <div class="avatar avatar-online avatar-placeholder max-w-fit">
          <div class="bg-neutral text-neutral-content w-16 rounded-full">
            <span class="text-xl">{$form.firstName?.at(0) ?? '?'}</span>
          </div>
        </div>

        <label for="email" class="label mt-2">Email</label>
        <input id="email" type="email" class="input" value={user.email} disabled readonly />

        <label for="firstName" class="label">First name</label>
        <input
          name="firstName"
          type="text"
          bind:value={$form.firstName}
          {...$constraints.firstName}
          aria-invalid={$errors.firstName ? 'true' : undefined}
          class="input"
          placeholder="Roofus"
        />
        {#if $errors.firstName}
          <p class="text-error text-sm">{JSON.stringify($errors.firstName)}</p>
        {/if}

        <label for="lastName" class="label">Last name</label>
        <input
          name="lastName"
          type="text"
          bind:value={$form.lastName}
          {...$constraints.lastName}
          aria-invalid={$errors.lastName ? 'true' : undefined}
          class="input"
          placeholder="n'Doofus"
        />
        {#if $errors.lastName}
          <p class="text-error text-sm">{JSON.stringify($errors.lastName)}</p>
        {/if}
      </fieldset>
      {#if $errors._errors}
        <p class="text-error text-sm">{JSON.stringify($errors._errors)}</p>
      {/if}

      <div class="card-actions">
        <button type="submit" class="btn btn-primary" disabled={$submitting}>
          {#if $delayed}
            <div class="loading loading-dots loading-sm"></div>
          {:else}
            Update Profile
          {/if}
        </button>
      </div>
      <a href={route('/auth/reset-password')} class="link">Change password</a>
    </div>
  </form>

  <SuperDebug bind:data={$form} collapsible />

  <a href={route('/private')} class="btn btn-accent">
    Go to protected <code>/private</code> route
  </a>

  <DeleteAccountButton />
</div>

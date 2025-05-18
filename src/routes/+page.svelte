<script lang="ts">
  import Icon from '@iconify/svelte'
  import SuperDebug from 'sveltekit-superforms'
  import { superForm } from 'sveltekit-superforms'

  let { data } = $props()
  let user = $derived(data.user)

  const { form, errors, constraints, message, submitting, delayed, enhance } = $derived(
    superForm(data.form, {
      // These options allow form to be submitted multiple times and prevent page's `load()` function
      // from re-running. The form disappears after a successful submission if these are not set.
      invalidateAll: false,
      resetForm: false,
    }),
  )
</script>

{#if $message}
  <h3>{$message}</h3>
{/if}

{#if user}
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
          <input
            id="email"
            type="email"
            class="input"
            value={user.email}
            disabled
            readonly
          />

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
          <button type="submit" disabled={$submitting} class="btn btn-primary">
            {#if $delayed}
              <div class="loading loading-dots h-8 w-8"></div>
            {:else}
              Update Profile
            {/if}
          </button>
        </div>
      </div>
    </form>

    <SuperDebug bind:data={$form} collapsible />

    <a href="/private" class="btn btn-accent">
      Go to protected <code>/private</code> route
    </a>

    <button
      type="button"
      class="btn btn-error mt-4"
      onclick={async () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          const res = await fetch('/auth/deleteAccount', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
          })
          if (res.ok) {
            window.location.href = '/';
          } else {
            alert('Failed to delete account.');
          }
        }
      }}
    >
      Delete account
    </button>
  </div>
{:else}
  <div class="hero min-h-72 ring-1">
    <div class="hero-content flex-col">
      <div class="flex items-center justify-center gap-2">
        <Icon icon="logos:svelte-icon" class="h-24 w-24" />
        <div>+</div>
        <Icon icon="logos:supabase-icon" class="h-24 w-24" />
      </div>
      <a href="/auth/signIn" class="btn btn-lg btn-block">Login</a>
    </div>
  </div>
{/if}

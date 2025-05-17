<script lang="ts">
  import Icon from '@iconify/svelte'
  import SuperDebug from 'sveltekit-superforms'
  import { superForm } from 'sveltekit-superforms'

  let { data } = $props()
  let user = $derived(data.user)

  const { form, errors, constraints, message, submitting, delayed, enhance } = $derived(
    superForm(data.form, {
      // These allow form to be submitted multiple times and prevent page's `load()` function from re-running.
      // Weirdly, the form will disappear after a successful submission if these are not set.
      invalidateAll: false,
      resetForm: false,
    }),
  )
  const avatar = ''
</script>

{#if $message}
  <h3>{$message}</h3>
{/if}

{#if user}
  <div class="card card-lg">
    <div class="card-content mx-auto flex flex-col gap-4">
      <form method="post" use:enhance>
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend class="fieldset-legend">Profile</legend>

          {#if avatar}
            <div class="avatar max-w-fit">
              <div class="w-24 rounded">
                <img src={avatar} alt="User avatar" />
              </div>
            </div>
          {:else}
            <div class="avatar avatar-online avatar-placeholder max-w-fit">
              <div class="bg-neutral text-neutral-content w-16 rounded-full">
                <span class="text-xl">{$form.firstName?.at(0) ?? '?'}</span>
              </div>
            </div>
          {/if}

          <label for="firstName" class="label">First name</label>
          <input
            name="firstName"
            type="text"
            bind:value={$form.firstName}
            {...$constraints.firstName}
            aria-invalid={$errors.firstName ? 'true' : undefined}
            class="input w-full"
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

          <button type="submit" disabled={$submitting} class="btn btn-accent">
            {#if $delayed}
              <div class="loading loading-dots h-8 w-8"></div>
            {:else}
              Update Profile
            {/if}
          </button>
        </fieldset>
        {#if $errors._errors}
          <p class="text-error text-sm">{JSON.stringify($errors._errors)}</p>
        {/if}
      </form>

      <div class="w-xs">
        <SuperDebug bind:data={$form} collapsible />
      </div>
    </div>
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

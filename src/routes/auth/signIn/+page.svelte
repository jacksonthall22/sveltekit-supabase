<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import ForgotPasswordLink from '../ForgotPasswordLink.svelte'
  import { route } from '$lib/ROUTES'

  let { data } = $props()
  let { form, errors, constraints, message, submitting, delayed, enhance } = $derived(
    superForm(data.form),
  )
</script>

{#if $message}
  <h3>{$message}</h3>
{/if}

<form method="POST" class="card-body" use:enhance>
  <fieldset class="fieldset w-xs py-4">
    <legend class="fieldset-legend text-lg">Sign in</legend>

    <label class="floating-label">
      <span>Email</span>
      <input
        type="email"
        name="email"
        placeholder="first.last@example.com"
        class="input input-md"
        bind:value={$form.email}
        aria-invalid={$errors.email ? 'true' : undefined}
        {...$constraints.email}
        required
        autocomplete="email"
      />
    </label>
    {#if $errors.email}
      <div class="text-error">{$errors.email}</div>
    {/if}

    <label class="floating-label">
      <span>Password</span>
      <input
        type="password"
        name="password"
        placeholder="********"
        class="input input-md"
        bind:value={$form.password}
        aria-invalid={$errors.password ? 'true' : undefined}
        {...$constraints.password}
        required
        autocomplete="current-password"
      />
    </label>
    {#if $errors.password}
      <div class="text-error">{$errors.password}</div>
    {/if}

    <div class="card-actions">
      <button type="submit" class="btn btn-primary" disabled={$submitting}>
        {#if $delayed}
          <div class="loading loading-dots loading-sm"></div>
        {:else}
          Sign in
        {/if}
      </button>
    </div>
  </fieldset>
  {#if $errors._errors}
    <div class="text-error">{$errors._errors}</div>
  {/if}

  <fieldset class="fieldset">
    <a href={route('/auth/signUp')} class="text-base-content/75 link w-max text-left text-sm">
      Create an account
    </a>
    <ForgotPasswordLink />
  </fieldset>
</form>

<div class="p-4">
  <SuperDebug bind:data={form} collapsible />
</div>

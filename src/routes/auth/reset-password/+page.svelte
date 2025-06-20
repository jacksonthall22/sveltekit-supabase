<script lang="ts">
  import { route } from '$lib/ROUTES.js'
  import { superForm } from 'sveltekit-superforms'

  let { data } = $props()
  let { form, errors, constraints, message, submitting, delayed, enhance } = $derived(
    superForm(data.form),
  )
  let user = $derived(data.user)
</script>

{#if $message}
  <h3 class="text-center text-lg font-semibold">{$message}</h3>
  {#if !user}
    <p class="text-center">
      <a href={route('/auth/signIn')} class="link">Login</a>
    </p>
  {:else}
    <p class="text-center">
      <a href={route('/')} class="link">Home</a>
    </p>
  {/if}
{/if}

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

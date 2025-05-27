<script lang="ts">
  import { PUBLIC_USE_HCAPTCHA } from '$env/static/public'
  import HCaptcha from '$lib/components/HCaptcha.svelte'
  import SuperDebug, { superForm } from 'sveltekit-superforms'
  import ForgotPasswordLink from '../ForgotPasswordLink.svelte'

  let { data } = $props()
  let { form, errors, constraints, message, submitting, delayed, enhance } = $derived(
    superForm(data.form),
  )
</script>

{#if $message}
  <h3>{$message}</h3>
{/if}

<form method="POST" class="card-body" use:enhance>
  <fieldset class="fieldset w-xs gap-4 py-4">
    <legend class="fieldset-legend mb-1 text-lg">Sign up</legend>

    <label class="floating-label">
      <span class="!text-lg">Email</span>
      <input
        type="email"
        name="email"
        class="input input-md"
        bind:value={$form.email}
        aria-invalid={$errors.email ? 'true' : undefined}
        {...$constraints.email}
      />
    </label>
    {#if $errors.email}
      <div class="text-error">{$errors.email}</div>
    {/if}

    <label class="floating-label">
      <span class="!text-lg">Password</span>
      <input
        type="password"
        name="password"
        class="input input-md"
        bind:value={$form.password}
        aria-invalid={$errors.password ? 'true' : undefined}
        {...$constraints.password}
      />
    </label>
    {#if $errors.password}
      <div class="text-error">{$errors.password}</div>
    {/if}

    <label class="floating-label">
      <span class="!text-lg">Confirm password</span>
      <input
        type="password"
        name="confirmPassword"
        class="input input-md"
        bind:value={$form.confirmPassword}
        aria-invalid={$errors.confirmPassword ? 'true' : undefined}
        {...$constraints.confirmPassword}
      />
    </label>
    {#if $errors.password}
      <div class="text-error">{$errors.confirmPassword}</div>
    {/if}

    <div class="grid grid-cols-2 gap-4">
      <label class="floating-label">
        <span class="!text-lg">First name</span>
        <input
          type="text"
          name="firstName"
          class="input input-md"
          bind:value={$form.firstName}
          aria-invalid={$errors.firstName ? 'true' : undefined}
          {...$constraints.firstName}
          autocomplete="given-name"
          required
        />
      </label>
      {#if $errors.firstName}
        <div class="text-error">{$errors.firstName}</div>
      {/if}
      <label class="floating-label">
        <span class="!text-lg">Last name</span>
        <input
          type="text"
          name="lastName"
          class="input input-md"
          bind:value={$form.lastName}
          aria-invalid={$errors.lastName ? 'true' : undefined}
          {...$constraints.lastName}
          autocomplete="family-name"
          required
        />
      </label>
    </div>
    {#if $errors.lastName}
      <div class="text-error">{$errors.lastName}</div>
    {/if}
    {#if $errors.firstName}
      <div class="text-error">{$errors.firstName}</div>
    {/if}

    <div class="card-actions">
      <button type="submit" class="btn btn-primary" disabled={$submitting}>
        {#if $delayed}
          <div class="loading loading-dots loading-sm"></div>
        {:else}
          Create account
        {/if}
      </button>
    </div>
  </fieldset>
  {#if $errors._errors}
    <div class="text-error">{$errors._errors}</div>
  {/if}

  {#if PUBLIC_USE_HCAPTCHA}
    <HCaptcha bind:token={$form.hCaptchaToken!} />
  {/if}

  <fieldset class="fieldset">
    <a href="/auth/signIn" class="text-base-content/75 link w-max text-left text-sm">
      Log in instead
    </a>
    <ForgotPasswordLink />
  </fieldset>
</form>

<div class="p-4">
  <SuperDebug bind:data={form} collapsible />
</div>

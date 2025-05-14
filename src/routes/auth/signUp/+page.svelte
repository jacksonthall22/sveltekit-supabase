<script lang="ts">
  import { PUBLIC_USE_HCAPTCHA } from '$env/static/public'
  import HCaptcha from '$lib/components/HCaptcha.svelte'
  import { superForm } from 'sveltekit-superforms'
  import SuperDebug from 'sveltekit-superforms'

  let { data } = $props()
  let { form, enhance, errors, constraints, message, delayed } = $derived(superForm(data.form))

  $effect(() => {
    // Focus on first error
    if (Object.keys(errors).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
  })
</script>

<div class="card card-border w-sm">
  <form method="POST" action="?/signUp" class="card-body" use:enhance>
    <label class="label block">
      Email
      <input name="email" bind:value={$form.email} type="email" class="input block w-full" />
    </label>

    <label class="label block">
      Choose a password
      <input
        name="password"
        bind:value={$form.password}
        type="password"
        class="input block w-full"
      />
    </label>

    <div class="grid grid-cols-2 gap-4">
      <label class="label block">
        First name
        <input
          name="firstName"
          bind:value={$form.firstName}
          type="text"
          class="input block w-full"
        />
      </label>
      <label class="label block">
        Last name
        <input name="lastName" bind:value={$form.lastName} type="text" class="input block w-full" />
      </label>
    </div>

    <a href="/auth/signIn" class="text-base-content/75 link text-left text-sm"> Log in instead </a>
    <a href="/auth/recovery" class="text-base-content/75 link text-sm"> Forgot password? </a>

    {#if PUBLIC_USE_HCAPTCHA}
      <HCaptcha bind:token={$form.hCaptchaToken!} />
    {/if}

    <div class="card-actions">
      <button type="submit" class="btn btn-primary">Create account</button>
    </div>
  </form>
</div>

<SuperDebug bind:data={form} />

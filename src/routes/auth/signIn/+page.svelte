<script lang="ts">
  import { PUBLIC_USE_HCAPTCHA } from '$env/static/public'
  import HCaptcha from '$lib/components/HCaptcha.svelte'
  import { superForm } from 'sveltekit-superforms'
  import SuperDebug from 'sveltekit-superforms'

  let { data } = $props()

  let {
    form,
    enhance,
    errors,
    constraints,
    message,
    delayed
  } = $derived(superForm(data.form))


  $effect(() => {
    // Focus on first error
    if (Object.keys(errors).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
  })
</script>

<div class="card card-border w-sm">
  <form method="POST" action="?/signIn" class="card-body" use:enhance>
    <label class="label block">
      Email
      <input
        name="email"
        type="email"
        bind:value={$form.email}
        class="input block w-full"

      />
    </label>

    <label class="label block">
      Password
      <input
        name="password"
        bind:value={$form.password}
        type="password"
        class="input block w-full"
      />
    </label>

    <a
      href="/auth/signUp"
      class="text-base-content/75 link text-left text-sm"
    >
      Create an account
    </a>
    <a href="/auth/recovery" class="text-base-content/75 link text-sm"> Forgot password? </a>

    {#if PUBLIC_USE_HCAPTCHA}
      <HCaptcha bind:token={$form.hCaptchaToken!} />
    {/if}

    <div class="card-actions">
      <button type="submit" class="btn btn-primary">Sign in</button>
    </div>
  </form>
</div>

<SuperDebug bind:data={$form} />

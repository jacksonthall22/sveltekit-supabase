<script lang="ts">
  import { enhance } from '$app/forms'
  import HCaptcha from '$lib/components/HCaptcha.svelte'
  import { superForm } from 'sveltekit-superforms'

  let { data } = $props()
  let user = $derived(data.user)

  let sign: 'in' | 'up' = $state('in')
  let signInForm = $derived(data.signInForm)
  let signUpForm = $derived(data.signUpForm)
  let activeForm = $derived(sign === 'in' ? signInForm : signUpForm)
  let formAction = $derived(sign === 'in' ? '?/signIn' : '?/signUp')

  let { form, errors, constraints, message, delayed } = $derived(superForm(activeForm))

  $inspect('form', $form)
  $inspect('errors', $errors)
  $inspect('constraints', $constraints)
  $inspect('message', $message)
  $inspect('delayed', $delayed)
</script>

<div class="card card-border w-sm">
  <form method="POST" action={formAction} class="card-body" use:enhance>
    <label class="label block">
      Email
      <input name="email" type="email" class="input block w-full" />
    </label>
    <label class="label block">
      Password
      <input name="password" type="password" class="input block w-full" />
    </label>
    <button
      class="text-left text-base-content/75 link text-sm"
      onclick={() => (sign = sign === 'in' ? 'up' : 'in')}
    >
      {sign === 'in' ? 'Create an account' : 'Log in instead'}
    </button>
    <a href="/auth/recovery" class="text-base-content/75 link text-sm"> Forgot password? </a>
    <HCaptcha />
    <div class="card-actions">
      <div class="flex gap-4">
        <button type="submit" class="btn btn-primary">Sign {sign}</button>
      </div>
    </div>

    {#if $errors}
      <div class="bg-base-200 text-base-content p-4 text-xs">
        <code class="whitespace-pre-wrap">{JSON.stringify(signInForm.errors, undefined, 2)}</code>
      </div>
    {/if}
  </form>
</div>

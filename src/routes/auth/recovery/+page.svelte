<script lang="ts">
  import { superForm } from 'sveltekit-superforms'

  const { data } = $props()
  const { form, errors, constraints, message, submitting, delayed, enhance } = superForm(
    data.form,
    {
      // These options allow form to be submitted multiple times and prevent page's `load()` function
      // from re-running. The form disappears after a successful submission if these are not set.
      invalidateAll: false,
      resetForm: false,
    },
  )
</script>

{#if $message}
  <h3>{$message}</h3>
{/if}

<form method="POST" class="card-body" use:enhance>
  <fieldset class="fieldset w-xs py-4">
    <legend class="fieldset-legend text-lg">Reset password</legend>

    <label for="email" class="floating-label">
      <span>Email</span>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email"
        class="input input-bordered w-full"
        bind:value={$form.email}
        aria-invalid={$errors.email ? 'true' : undefined}
        {...$constraints.email}
        required
      />
    </label>
    {#if $errors.email}
      <div class="text-error">{$errors.email}</div>
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
        Send reset link
      {/if}
    </button>
  </div>
</form>

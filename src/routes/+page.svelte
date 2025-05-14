<script lang="ts">
  import Icon from '@iconify/svelte'
  import SuperDebug from 'sveltekit-superforms'
  import { superForm } from 'sveltekit-superforms'

  let { data } = $props()
  let user = $derived(data.user)

  const { form, errors, constraints, message, submitting, delayed, enhance } = superForm(data.form);

  const avatar = ''
</script>

{#if user}
  <div class="bg-base-100 border-base-300 collapse border">
    <input type="checkbox" checked />
    <div class="collapse-title font-semibold">Debug info</div>
    <div class="collapse-content text-sm">
      <SuperDebug bind:data={$form} />
    </div>
  </div>

  <div class="card card-lg">
    <div class="card-content">
      <form method="post" action='?' use:enhance>
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
                <span class="text-xl">C</span>
              </div>
            </div>
          {/if}

          <label for="firstName" class="label">First name</label>
          <input
            name="firstName"
            type="text"
            bind:value={$form.firstName}
            class="input w-full"
            placeholder="Roofus"
          />

          <label for="lastName" class="label">Last name</label>
          <input
            name="lastName"
            type="text"
            bind:value={$form.lastName}
            class="input"
            placeholder="n'Doofus"
          />

          <label for="email" class="label">Email</label>
          <input name="email" type="email" bind:value={$form.email} class="input" placeholder="Email" />

          <button type="submit" disabled={$submitting} class="btn btn-accent">
            {#if $delayed}
              <div class="loading loading-dots h-8 w-8"></div>
            {:else}
              Update Profile
            {/if}
          </button>
        </fieldset>
      </form>
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
      <a href="/auth" class="btn btn-lg btn-block">Login</a>
    </div>
  </div>
{/if}

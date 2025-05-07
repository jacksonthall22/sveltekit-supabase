<script lang="ts">
  import SuperDebug from 'sveltekit-superforms'
  import type { UpdateProfileFormValidated } from '../../routes/+page.server'
  import { superForm } from 'sveltekit-superforms'

  interface Props {
    form: UpdateProfileFormValidated
  }
  let { form: formRaw }: Props = $props()

  const { form, errors, constraints, message, submitting, delayed, timeout, enhance } = superForm(
    formRaw,
    {
      delayMs: 500,
      timeoutMs: 8000
    }
  )

  let avatar = ''
  let firstName: string = $state(`${$form.firstName}`)
  let lastName: string = $state(`${$form.lastName}`)
  let email: string = $state(`${$form.email}`)
</script>

<div class="collapse bg-base-100 border-base-300 border">
  <input type="checkbox" />
  <div class="collapse-title font-semibold">Debug info</div>
  <div class="collapse-content text-sm">
<SuperDebug bind:data={formRaw} />
  </div>
</div>

<div class="card card-lg">
  <div class="card-content">
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
              <span class="text-xl">C</span>
            </div>
          </div>
        {/if}

        <label for="firstName" class="label">First name</label>
        <input
          name="firstName"
          type="text"
          bind:value={firstName}
          class="input w-full"
          placeholder="Roofus"
        />

        <label for="lastName" class="label">Last name</label>
        <input
          name="lastName"
          type="text"
          bind:value={lastName}
          class="input"
          placeholder="n'Doofus"
        />

        <label for="email" class="label">Email</label>
        <input name="email" type="email" bind:value={email} class="input" placeholder="Email" />

        <button type="submit" disabled={$submitting} class="btn btn-accent">
          {#if $delayed}
            <div class='loading loading-dots w-8 h-8'></div>
          {:else}
            Update Profile
          {/if}
        </button>
      </fieldset>
    </form>
  </div>
</div>

<!-- 
  <Card.Root class="mx-auto max-w-md">
	<Card.Header>
	  <Card.Title class="text-3xl font-thin">Profile</Card.Title>
	  <Card.Description>Update your profile information</Card.Description>
	</Card.Header>
	<Card.Content>
	  {#if avatar}
		<div class="flex justify-start">
		  <img src={avatar} alt="user avatar" class="mb-5 h-24 w-24 rounded-lg object-cover shadow" />
		</div>
	  {/if}
	  <form
		method="post"
		use:enhance={({ formData }) => {
		  formData.set('firstName', userProfile.firstName)
		  formData.set('lastName', userProfile.lastName)
		  formData.set('email', userProfile.email)
		  formData.set('username', userProfile.username)
		  return ({ result }) => {
			if (result.type === 'success') {
			  invalidate('/')
			  alert('UPDATED!')
			} else {
			  alert('ERROR!')
			}
		  }
		}}
	  >
		<div class="flex items-center gap-2">
		  <div class="w-full">
			<Label>First Name</Label>
			<Input bind:value={userProfile.firstName} />
		  </div>
		  <div class="w-full">
			<Label>Last Name</Label>
			<Input bind:value={userProfile.lastName} />
		  </div>
		</div>
  
		<div class="mt-4">
		  <Label>Email</Label>
		  <Input bind:value={userProfile.email} />
		</div>
  
		<div class="mt-5">
		  <Button type="submit" class="w-full">Update Profile</Button>
		</div>
	  </form>
	</Card.Content>
  </Card.Root> -->

<script lang="ts">
  import type { PageData } from './$types'
  import { enhance } from '$app/forms'

  let { data }: { data: PageData } = $props()
</script>

<h1 class="mb-4 text-center text-3xl font-bold">Reset password</h1>

<!-- Form to set new password, with "confirm password" field -->
<form
  method="POST"
  action="?/resetPassword"
  class="mx-auto mt-16 max-w-md space-y-6 rounded-lg bg-white p-8 shadow dark:bg-zinc-900"
  use:enhance
>
  <div class="form-control">
    <label for="password" class="label">
      <span class="label-text">New password</span>
    </label>
    <input
      type="password"
      name="password"
      id="password"
      placeholder="Enter your new password"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <label for="confirmPassword" class="label">
      <span class="label-text">Confirm password</span>
    </label>
    <input
      type="password"
      name="confirmPassword"
      id="confirmPassword"
      placeholder="Confirm your new password"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <button type="submit" class="btn btn-primary w-full"> Reset password </button>
  </div>
</form>

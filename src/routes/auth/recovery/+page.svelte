<script lang="ts">
  import { enhance } from '$app/forms'
</script>

<h1 class="mb-4 text-center text-3xl font-bold">Reset password</h1>


<form
  method="POST"
  action="?/resetPassword"
  class="mx-auto mt-16 max-w-md space-y-6 rounded-lg p-8 shadow card"
  use:enhance
>
  <div class="form-control">
    <label for="email" class="label">
      <span class="label-text">Email</span>
    </label>
    <input
      type="email"
      name="email"
      id="email"
      placeholder="Enter your email"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <button type="submit" class="btn btn-primary w-full">
      Send reset link
    </button>
  </div>
</form>

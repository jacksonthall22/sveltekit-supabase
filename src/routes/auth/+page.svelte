<script lang="ts">
    import { enhance } from '$app/forms'
    import HCaptcha from '$lib/components/HCaptcha.svelte'
</script>

<form
  method="POST"
  action="?/login"
  class="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow space-y-6"
  use:enhance
>
  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
    Email
    <input
      name="email"
      type="email"
      class="mt-1 block w-full rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </label>
  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
    Password
    <input
      name="password"
      type="password"
      class="mt-1 block w-full rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </label>
  <a href='/auth/recovery' class="text-sm text-base-content/75 link">
    Forgot password?
  </a>
  <HCaptcha />
  <div class="flex gap-4">
    <button
      type="submit"
      class="flex-1 bg-primary text-primary-foreground font-semibold py-2 px-4 rounded hover:bg-primary/90 transition-colors"
      >Login</button
    >
    <button
      type="submit"
      formaction="?/signup"
      class="flex-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold py-2 px-4 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
      >Sign up</button
    >
  </div>
</form>

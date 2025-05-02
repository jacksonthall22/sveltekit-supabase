<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
        <div class="max-w-md flex flex-col gap-2">
            <h1 class="text-5xl font-bold mb-3">Oops!</h1>
            <code>{$page.status}: {$page.error?.message}</code>
            <p>Something went wrong. Please try again later.</p>
        </div>
    </div>
</div>

import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { kitRoutes } from 'vite-plugin-kit-routes'

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit(), kitRoutes()],
})

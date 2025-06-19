import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { kitRoutes } from 'vite-plugin-kit-routes'

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit(), kitRoutes({
    // We use `kitRoutes` to dynamically generate a `ROUTES.ts` file to faciilitate type-safe routing
    // based on the routes in our `src/routes/` dir.
    // This is useful for getting warned about missing/broken links in the app!
    // We can also use it to set external links that might be used in multiple places - and everything
    // is still type-safe!
    // https://www.kitql.dev/docs/tools/06_vite-plugin-kit-routes#external-links
    LINKS: {
      jacksonLinkedin: 'https://linkedin.com/in/jackson-t-hall',
      engageintellectGithub: 'https://github.com/engageintellect'
    }
  })],
})

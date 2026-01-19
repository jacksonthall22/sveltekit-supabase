# 🚀 `sveltekit-supabase` 🚀

## Description

A SvelteKit starter app with email/password login, and some other nice bells & whistles!

## Technologies

- [SvelteKit](https://kit.svelte.dev/): A framework for building web applications with Svelte
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript
- [Supabase](https://supabase.io/): An open-source Firebase alternative
- [Zod](https://zod.dev): A TypeScript-first schema declaration and validation library
- [svelte-persisted-state](https://github.com/oMaN-Rod/svelte-persisted-state): Svelte 5 state runes persisted to localStorage, sessionStorage, or cookies
- [vite-plugin-kit-routes](https://www.kitql.dev/docs/tools/06_vite-plugin-kit-routes): Automatically generates a `ROUTES.ts` file in SvelteKit projects that facilitates type-safe `href` routing to avoid broken links
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework
- [DaisyUI](https://daisyui.com/): A "collection of CSS class names", like an extension of Tailwind with easy theming options
- [Iconify](https://iconify.design): A unified icon framework using icons from [icones.js](https://icones.js.org/collection/all)

## Features

- Supabase Authentication ([PKCE flow](https://supabase.com/docs/guides/auth/passwords?queryGroups=language&language=js&queryGroups=flow&flow=pkce&queryGroups=framework&framework=sveltekit))
  - Sign up/in/out
  - hCaptcha spam prevention
  - Change/recover password
  - Server-side redirects for protecting routes
- Drizzle + Postgres + Zod for storing additional account data
- SvelteKit SuperForms + Zod for form parsing, validation, progressive enhancement, and reactive `submitting`/`delayed` state handling
- Light/dark mode stored reactively in cookies with [`svelte-persisted-state`](https://github.com/oMaN-Rod/svelte-persisted-state)
  - Set reactively client-side
  - Set proactively server-side by transforming HTML in `hooks.server.ts` to prevent [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)!
  - Ready to extend to store/load arbitrary site-wide settings!
- Custom site-wide reactive toast messaging system

## Getting Started

1. Clone this repo

   ```bash
   git clone https://github.com/jacksonthall22/sveltekit-supabase
   cd sveltekit-supabase
   ```

1. Install dependencies

   ```bash
   pnpm i
   ```

1. [Create a Supabase project](https://supabase.com/dashboard/new). The default settings and free tier are fine! Save your `Database password` for later.

1. Set up in Supabase:
   1. Disable Legacy API Keys: `Project Settings > API Keys > Legacy API Keys tab > Disable legacy API keys`.

   1. Generate publishable/secret keys: `Project Settings > API Keys > API Keys tab > Create new API keys`

   1. Password settings: `Authentication > Sign In / Providers > Email`

   1. Turn off `Confirm email` (optional): `Authentication > Sign In / Providers > Confirm email (off)`

   1. Email auth settings (recommended): `Authentication > Sign In / Providers > Email`:
      - `Secure email change`: on
      - `Secure password change`: on
      - `Minimum password length`: 14
      - `Password Requirements`: Lowercase, uppercase letters, digits and symbols
      - `Email OTP Length`: 6
      - `Save`
   
   1. Enable hCaptcha verification: `Authentication > Attack Prevention > Enable Captcha protection`
  
   1. Change `Authentication > URL Configuration > Site URL`: `http://localhost:5173` & save

   1. Update email templates for sign up / password reset flows ([original docs](https://supabase.com/docs/guides/auth/passwords?queryGroups=language&language=js&queryGroups=flow&flow=pkce&queryGroups=framework&framework=sveltekit)): `Authentication > Emails > ...`:
      1. `Confirm sign up`:
          ```html
          <h2>Confirm your signup</h2>
          
          <p>Follow this link to confirm your user:</p>
          <p>
            <a
              href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}"
              >Confirm your email</a
            >
          </p>
          ```
      1. `Reset password`:
         ```html
         <h2>Reset Password</h2>
         <p>Follow this link to reset the password for your user:</p>
         <p>
           <a
             href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next={{ .RedirectTo }}"
             >Reset Password</a
           >
         </p>
         ```

1. Create a `.env` based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

1. Fill in your own Supabase keys in `.env`. In your Supabase project, click
   <img height="20" alt="image" src="https://github.com/user-attachments/assets/71aa32c9-f51e-4bc1-8426-779df3ad0f45" />
   and find the four vars:
   - `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`:
     <img width="2036" height="662" alt="image" src="https://github.com/user-attachments/assets/2c8db2f2-c262-4b55-8853-06fb4de939aa" />
   - `PRIVATE_DATABASE_URL`:
     <img width="2040" height="656" alt="image" src="https://github.com/user-attachments/assets/5034db6a-15b0-468b-8f5c-d6147b8a9c8d" />
   - `PRIVATE_SUPABASE_SECRET_KEY`: From earlier step, `Project Settings > API Keys > API Keys tab > Secret Keys > default`

1. [Create an hCaptcha site](https://dashboard.hcaptcha.com/welcome). Copy the sitekey and generate a secret key, then
   paste in `.env` (no need to install any plugins for step 3, just click `Done`).

1. Push database schema to Supabase with [Drizzle](https://orm.drizzle.team/)

   ```bash
   pnpm exec drizzle-kit push
   ```

1. Start your app

   ```bash
   pnpm dev
   ```

1. Navigate to [`http://localhost:5173`](http://localhost:5173) to see your app running!

## Troubleshooting

<sub>(Feel free to open issues with any questions about missing steps here!)</sub>

- Might need to update the redirect URL sent in change-password emails in Supabase project settings - I think after deploying to vercel, the live site might still try to redirect to `localhost`

## Deploying to Vercel

<sub>(TODO: verify these are all the steps needed)</sub>

1. Create a new project in the Vercel dashboard

1. Install the Vercel CLI

   ```bash
   pnpm add -g vercel
   ```

1. Build

   ```bash
   pnpm build
   ```

1. Deploy!

   ```bash
   vercel --prod
   ```

## Contributing

Contributions are welcome! Please feel free to submit a PR or open issues.

## Thanks

Shout out to [Davis Media](https://github.com/Davis-Media) for building the base-base template for this project! 🤙

Shout out to [engageintellect](https://github.com/engageintellect) for building the base template for this project! 🤙

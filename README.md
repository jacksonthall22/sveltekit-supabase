# 🚀 `sveltekit-supabase` 🚀

## Description

A SvelteKit starter app with email/password login, and some other nice bells & whistles!

## Features
- Supabase Authentication ([PKCE flow](https://supabase.com/docs/guides/auth/passwords?queryGroups=language&language=js&queryGroups=flow&flow=pkce&queryGroups=framework&framework=sveltekit) - **TODO**: follow these docs for setting up Supabase project settings)
  - Sign up
  - Sign in
  - Sign out
  - Change/recover password
  - Update account info
  - Server-side redirects for protected routes using `authGuard()` in `hooks.server.ts`
  - hCaptcha for sign in/up (WIP)
- Drizzle + Postgres + Zod for storing additional account data (**TODO**: set up RLS in Supabase)
- SvelteKit SuperForms + Zod for form parsing, validation, progressive enhancement, and `submitting`/`delayed` state handling for nice UI
- Custom site-wide reactive toast messaging system
- Light/dark mode stored reactively in cookies with [`svelte-persisted-state`](https://github.com/oMaN-Rod/svelte-persisted-state)
  - Transforms HTML server-side in `hooks.server.ts` to prevent [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)!
  - Ready to extend to store/load arbitrary site-wide settings!
- Custom system-wide reactive toast message system

## Technologies

- [SvelteKit](https://kit.svelte.dev/): A framework for building web applications with Svelte
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript
- [Supabase](https://supabase.io/): An open-source Firebase alternative
- [Zod](https://zod.dev): A TypeScript-first schema declaration and validation library
- [svelte-persisted-state](https://github.com/oMaN-Rod/svelte-persisted-state): Svelte 5 state runes persisted to localStorage, sessionStorage, or cookies
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework
- [DaisyUI](https://daisyui.com/): A "collection of CSS class names", like an extension of Tailwind with easy theme options
- [Iconify](https://iconify.design): A unified icon framework using icons from [icones.js](https://icones.js.org/collection/all)

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

1. Create a `.env` based on `.env.example` and fill in your own credentials
    ```bash
    cp .env.example .env
    ```

1. Push database schema to Supabase with [Drizzle](https://orm.drizzle.team/)
    ```bash
    npx drizzle-kit push
    ```

1. Start your app
    ```bash
    pnpm dev
    ```

1. Navigate to [`localhost:5173`](http://localhost:5173) to see your app running!

### Other required setup

<sub>(TODO - document these better, I'm trying to remember after the fact...)</sub>

- Change `Site URL` in supabase project settings (go to `https://supabase.com/dashboard/project/<project_id>/auth/url-configuration`)
- Change email templates accoring to PKCE docs [here](https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce&queryGroups=framework&framework=sveltekit&queryGroups=language&language=js#resetting-a-password)
- There may be some problems with CORS in Supabase
- Might need to update the redirect URL sent in change-password emails in Supabase project settings (I think after deploying to vercel, the live site might try to redirect to `localhost` still)

# Deploying to Vercel

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

# Contributing

Contributions are welcome! Please feel free to submit a PR or open an issue.

# Thanks

Shout out to [Davis Media](https://github.com/Davis-Media) for building the base-base template for this project! 🤙

Shout out to [engageintellect](https://github.com/engageintellect) for building the base template for this project! 🤙

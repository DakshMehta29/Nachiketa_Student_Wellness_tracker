Manasfit

## Dynamic setup (Supabase)

1. Create a Supabase project at `https://supabase.com`.
2. In Project Settings → API, copy:
   - Project URL → set as `VITE_SUPABASE_URL`
   - anon key → set as `VITE_SUPABASE_ANON_KEY`
3. Create a table `testimonials` with columns:
   - `id` integer, primary key
   - `name` text
   - `university` text
   - `year` text
   - `quote` text
   - `avatar` text
   - `rating` integer
4. Insert a few rows.

### Environment

Create `.env` in project root:

```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart `npm run dev` after editing env.

### Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — lint

## AI Chat (OpenAI gpt-4o-mini)

1. Create an OpenAI API key and set it in `.env` at project root:
```
OPENAI_API_KEY=your-openai-key
```
2. Install deps and run both servers:
```
npm install
npm run dev:all
```
Frontend: `http://localhost:5173` → Chat and Visualization sections call dev proxy `/api/*` to the local API on `8787`.

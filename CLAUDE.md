# Guy's Notes App

A notes sharing platform where Guy uploads class PDFs and classmates browse/download them publicly.

## Tech Stack
- **Frontend:** React 18 + Vite 8, TailwindCSS v4 (`@tailwindcss/vite`), hand-written shadcn/ui components, `@dnd-kit` for drag-and-drop
- **Backend:** Supabase (PostgreSQL + Storage + Google OAuth)
- **Deploy:** Vercel (auto-deploy from `main`), `.npmrc` has `legacy-peer-deps=true`

## Key Files
- `src/api/` — Supabase client, courses CRUD, notes CRUD + file upload
- `src/pages/` — Home (course grid + General tab), CoursePage (notes list), Admin (manage everything), Login
- `src/lib/auth.jsx` — AuthProvider with Google OAuth, owner check via email
- `src/lib/constants.js` — Owner email, semesters, note types
- `supabase-setup.sql` — Database schema, RLS policies, `is_owner()` function

## Auth Model
- Owner email hardcoded in `constants.js` and SQL `is_owner()` function
- Admin accessed via `/admin` URL (no visible link in UI)
- Public users can browse and view PDFs without login

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- Push to `main` → auto-deploys to Vercel

## Notes
- No dark mode (removed intentionally)
- Hebrew text uses `dir="auto"` throughout
- Notes have `display_order` column for manual ordering via drag-and-drop
- Notes can be standalone (no course) — shown under "General" tab on home page
- Notes have an optional `description` field (admin remark shown publicly)

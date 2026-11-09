# Renderlane — studio website

_Your lane to the web._

This is the Renderlane website. It's built with Next.js 15, React 19, Three.js (React Three Fiber), Framer Motion, Lenis and Tailwind CSS 4. Inquiries are saved to Supabase and shown in a private admin dashboard.

## What's inside

- **Intro preloader** with a 0–100 counter and the logo. It plays once per visit.
- **Hero** with a looping video background (`public/video/hero.mp4`), a **3D glass hexagon gem** made from the logo, and chevrons that slide in from the sides. The gem follows the mouse and reacts to scrolling, and clicking it makes it spin.
- **Interactions:** smooth scrolling, a custom cursor, magnetic buttons, text that reveals word by word, a scroll progress bar, a marquee, spotlight cards, 3D tilt project cards, an animated timeline, an FAQ accordion and a parallax footer.
- **Inquiry form:** name, company, email, phone, project name, requirements, services, budget and timeline. It validates input, has hidden spam protection and rate limiting, and shows a success animation.
- **Admin dashboard** at `/admin`, protected by a password. It shows counts, search, status filters, a details panel with email, WhatsApp and call buttons, a status tracker (New → Contacted → In progress → Won/Lost), private notes, delete and CSV export.

## 1. Install

You need **Node.js 20 or newer**.

```bash
npm install
```

## 2. Set up Supabase (about 5 minutes)

1. Create a free project at https://supabase.com.
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**.
3. Open **Project Settings → API** and copy:
   - the **Project URL**
   - the **service_role** secret key (not the anon key)

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

| Variable | What it is |
| --- | --- |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | The service_role key. Server-only, so never commit it or put it in client code |
| `ADMIN_PASSWORD` | The password you'll use at `/admin/login` |
| `ADMIN_SESSION_SECRET` | Any random string with 32 or more characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

## 4. Run it

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

## 5. Deploy (Vercel recommended)

1. Push the project to GitHub (`.env.local` is ignored, which is good).
2. Import the repository at https://vercel.com/new.
3. Add the same 4 environment variables in **Project → Settings → Environment Variables**.
4. Deploy, then connect your domain (for example, renderlane.com).

## Customizing

- **Text, services, FAQs, contact details:** `src/lib/site.ts`. Replace the placeholder email, phone and social links there.
- **Colors:** `src/app/globals.css`, in the `@theme` block (`--color-violet`, etc.).
- **Hero video:** replace `public/video/hero.mp4` and `hero-poster.jpg` with your own showreel. Keep it short (8–15 seconds), muted, 1080p or smaller, and under about 5 MB.
- **3D gem:** `src/components/three/HeroScene.tsx`. On phones and weaker devices it automatically uses a lighter material.
- **Logo:** `src/components/brand/Logo.tsx` (an SVG version of your logo). The original image is in `public/brand/`.
- **Projects:** the "Selected work" cards are labelled **Concept**. Replace them with real case studies as you finish projects.

## Project structure

```
src/
  app/
    page.tsx                 home page (all sections)
    layout.tsx               fonts, metadata
    globals.css              theme + global styles
    api/inquiries/           POST: save an inquiry
    api/admin/inquiries/[id] PATCH status/notes, DELETE
    admin/                   dashboard, login, server actions
  components/
    site/                    page sections (Hero, Services, Contact, …)
    three/HeroScene.tsx      3D gem
    ui/                      Reveal, Magnetic, ScrollLink, Icon
    brand/Logo.tsx           SVG logo
  lib/                       site content, validation, Supabase, auth
  middleware.ts              protects /admin and /api/admin
supabase/schema.sql          database table
```

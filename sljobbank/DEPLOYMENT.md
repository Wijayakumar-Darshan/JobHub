# Deploying SL Job Bank on Free Cloud Services

Yes, this whole system can run on free tiers. I switched the database layer to Postgres and tested it for real (installed Postgres locally, ran the full register→login→onboarding→admin flow against it) specifically so it would work cleanly with Supabase's free Postgres - meaning **one Supabase project can now serve as both your main database AND your real-time chat storage**, instead of needing two separate services.

## Be honest with yourself about what "free" means here

Before you deploy this for real students, understand what these free tiers actually give you, verified as of mid-2026:

| Service | What you get free | The catch |
|---|---|---|
| **Render** (backend) | 750 hrs/month, no card required | Sleeps after 15 min of no traffic; next request takes 30-60s to wake up |
| **Supabase** (database + chat) | 500MB DB, no card required | Pauses after 7 days with zero DB activity; no backups on free tier |
| **Vercel or Netlify** (frontend) | Generous bandwidth/builds, no card required | None that matter for this project |

For a pilot, a school project, or early testing with real students who understand it's a beta, this is genuinely fine. For something you're staking a lot on with zero tolerance for a 30-60 second wait after idle periods or the small risk of losing data with no backup, you'd want to move the database at minimum to a paid tier ($25/mo Supabase Pro removes the pause and adds backups; Render's $7/mo tier removes the sleep). I'm telling you this upfront rather than letting you find out the hard way after 50 students hit a frozen loading screen during a demo.

**The one habit that fixes most of the free-tier annoyance**: set up a free uptime monitor (see step 4) that pings your API every few minutes. That alone keeps Render from sleeping and keeps Supabase from pausing, for zero cost.

---

## Step 1 — Database + Chat: Supabase (one project, two jobs)

1. Go to supabase.com → New Project. Note the **database password** you set - you'll need it.
2. Once created, go to **Project Settings → Database** and copy the **connection string host** (looks like `db.xxxxxxxx.supabase.co`).
3. Go to **Project Settings → API** and copy the **Project URL** and the **`service_role` key** (keep this secret - backend only) and the **`anon` public key** (safe for the frontend).
4. Run `db/supabase_chat_setup.sql` (in this project) in Supabase's **SQL Editor** - this creates the `chat_messages` table and enables Realtime + Row Level Security for it.
5. That's it for chat. The rest of your app's tables (users, jobs, clusters, etc.) get created automatically by `npm run db:sync` once your backend is deployed and pointed at this same database - no manual SQL needed for those.

## Step 2 — Backend: Render

1. Push this project to a GitHub repo.
2. On render.com → New → Web Service → connect your repo, set **Root Directory** to `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add these environment variables (Render's dashboard, not a committed `.env` file):

   ```
   DB_DIALECT=postgres
   DB_HOST=db.xxxxxxxx.supabase.co        (from Step 1.2)
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_supabase_db_password  (from Step 1.1)
   DB_SSL=true
   JWT_SECRET=<generate a long random string>
   SUPABASE_URL=https://xxxxxxxx.supabase.co
   SUPABASE_SERVICE_KEY=<service_role key from Step 1.3>
   CORS_ORIGIN=<your Vercel/Netlify URL from Step 3, add after that's live>
   ```
5. Deploy. Once it's live, open Render's **Shell** tab for this service (or run once locally pointed at the same DB) and run:
   ```
   npm run db:sync
   npm run db:seed
   ```
   This creates every table and seeds starter clusters/qualifications/institutes/the Career Key test/a test admin.
6. Your API is now live at `https://your-service.onrender.com/api`.

## Step 3 — Frontend: Vercel (or Netlify - both work the same way)

1. On vercel.com → New Project → import the same repo, set **Root Directory** to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Environment variables:
   ```
   VITE_API_URL=https://your-service.onrender.com/api
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key from Step 1.3 - safe to expose>
   ```
4. Deploy. Go back to Render (Step 2.4) and set `CORS_ORIGIN` to this Vercel URL, then redeploy the backend.

## Step 4 — Keep both services awake (free, 5 minutes to set up)

Sign up at **uptimerobot.com** (free) and add a monitor that pings `https://your-service.onrender.com/api/health` every 5 minutes. This single monitor:
- Stops Render from sleeping (traffic every 5 min, well under the 15-min idle window)
- Stops Supabase from pausing (any query, including the health check touching your DB via a lightweight route, counts as activity - if you want to be extra sure, point a second free monitor at an endpoint that actually queries the DB, like `/api/clusters`)

## Step 5 — First-time admin setup (do this once, not via the seeded demo admin)

Delete the seeded `admin@sljobbank.lk` account (`npm run db:seed` only creates it if no admin exists) and instead go to `https://your-frontend-url/admin/setup` and fill in the real admin's name, email, and password. This only works once - it refuses (409) if an admin already exists. See `CREATING_ACCOUNTS.md` for the full walkthrough of setting up the admin, students, and counselors.

## If you'd rather stay on MySQL instead of Postgres

Everything above works identically with `DB_DIALECT=mysql` and a free MySQL host (e.g., Aiven's free tier, Clever Cloud's free MySQL add-on - availability and limits on these change often, so check current terms before committing). You'd then need a separate free Supabase project just for chat, since MySQL and Supabase's Postgres would be two different databases in that setup.

# SL Job Bank — Phase 1 Update

## What's actually in this zip

**Backend (Spring Boot) — new and working, once you run the migration:**
- `Qualification`, `JobQualification`, `StudentProfile`, `AdminSecurity`, `AdminAuditLog` entities + repositories
- `GET/POST/PUT/DELETE /api/qualifications` — qualification CRUD (feeds the job-form dropdown)
- `GET/PUT /api/jobs/{jobId}/qualifications` — attach required qualifications + "where to get it" institute to a job
- `GET/POST/PUT/DELETE /api/institutes?type=` — Institutes AND Universities CRUD (same table, `type=UNIVERSITY` for the latter)
- `POST /api/student-profile/onboarding` — call right after registration with A/L stream + interest tags; builds the "preferred job type" profile
- `GET /api/student-profile/recommendations` — the recommendation engine, explained below
- `/api/admin-auth/*` — the new secure admin login (see below)
- SQL migration: `prisma/migration_phase1.sql`

**Recommendation engine (`RecommendationService`)**: scores every job for a student using cluster match, A/L stream match, favorites, and view history, all explainable point values — see the class comment in the code for the exact weights. It gets smarter automatically as the student favorites/views jobs (`StudentProfileService.reinforce`).

**Admin security (`AdminSecurityService`)**: replaces the "append a letter to the password" idea with a standard, actually-secure setup:
1. Strong password (BCrypt) + mandatory TOTP 2FA (Google/Microsoft Authenticator compatible, no external cost)
2. 5 failed attempts (wrong password OR wrong code) → auto-lockout for 30 minutes + an email with a one-time recovery link
3. Recovery link resets the password AND regenerates the 2FA secret, so a stolen password+device combo stops working
4. Every login attempt, success or fail, is written to `admin_audit_logs` with IP + user agent — visible via `GET /api/admin-auth/audit-log`
5. Only one `SUPER_ADMIN` can ever exist — enforced in code, not just UI

**First-time setup** (do this once, not via raw SQL):
```
POST /api/admin-auth/enroll-first-admin   { fullName, email, password }
→ scan the returned QR code in Google Authenticator
POST /api/admin-auth/confirm-enrollment   { email, code }
```
Delete the demo `u-admin-01` row from `seed.sql` before you deploy for real students — it bypasses this flow.

## Important — please read before assuming the frontend is done

I opened the project fully before writing code. Almost all of `frontend/src/pages/**` (student, counselor, admin) are 10-line placeholder files — they aren't wired to the API yet. There's also a 1,862-line `SLJobBank.jsx` at the project root, which is a **disconnected UI mockup** (fake in-memory data, not using your router or API client) — it looks like a design reference, not integrated code.

So "update the code" here really means: build the real pages from scratch, using that mockup as the visual reference, then wire each one to the endpoints above (and to the Phase 2–4 endpoints coming next). That's a much bigger job than editing existing working screens, and I didn't want to quietly gloss over that.

## Phase 2 — Career Key psychometric test engine (backend)

**Generic test engine, not hardcoded to one test** — `CareerTest` / `CareerTestQuestion` let you add more psychometric tests later the same way. Ships seeded with "Career Key": a 30-question RIASEC (Holland Code) interest inventory, 5 questions per category (Realistic, Investigative, Artistic, Social, Enterprising, Conventional), 1-5 Likert scale.

**Flow:**
1. `GET /api/career-tests` — list available tests
2. `GET /api/career-tests/{testId}/pre-test-info` — the required explainer screen: student's grade (from their profile), why take the test, what it identifies, question count, estimated time
3. `GET /api/career-tests/{testId}/questions`
4. `POST /api/career-tests/{testId}/start` → creates an attempt
5. `POST /api/career-tests/attempts/{id}/answers` — submit answers (can be called multiple times, upserts)
6. `POST /api/career-tests/attempts/{id}/complete` — scores it, returns the Holland Code, per-category percentages, recommended clusters, suggested jobs, and a plain-language guidance narrative. Also reinforces the student's personalization profile.
7. `GET /api/career-tests/my-attempts` — student's own history

**Scoring**: `CareerTestService` sums answers per RIASEC category, converts to a percentage, ranks categories, and takes the top 3 letters as the Holland Code (e.g. "IAS"). `RiasecClusterMapping` translates those letters into concrete `CareerCluster` recommendations and a written explanation — see that class if you want to tune the mapping.

**Download workflow** (`CareerTestResultAccessService`), matching your spec exactly:
- Student can always download their own result → `POST /api/career-tests/attempts/{id}/download`
- Admin can always view and download any result, no restriction → `GET /api/career-test-results/{id}/download`
- Counselor can VIEW any result any time (`GET /api/career-test-results`, `/{id}`) but can only DOWNLOAD once they've called `POST /api/career-test-results/{id}/enable-counselor-download` — which itself only succeeds *after* the student has downloaded at least once. Trying to enable it earlier returns HTTP 409 with an explanatory message.

**PDF export**: `CareerKeyReportService` reuses the iTextPDF dependency already in your `pom.xml` (same one your existing `ReportService` uses), so no new dependency needed.

**Migration**: run `prisma/migration_phase2.sql` after `migration_phase1.sql`. It adds the `grade` column to `student_profiles` and creates `career_tests`, `career_test_questions`, `career_test_attempts`, `career_test_answers`, seeded with the Career Key test and its 30 questions.

## Phase 3 — Monthly/yearly usage analytics + most/least searched jobs

**Login tracking**: every successful login (student, counselor, admin) now writes a row to the new `login_logs` table, via `AuthService.login()` and `AdminSecurityService.login()`. This is what "how many students are using the system" is actually counted from.

**Bug fix along the way**: `JobService.trackView()` was saving an empty, never-persisted `User` object instead of the actual viewer (`new User()` instead of looking the user up) — meaning job-view analytics were silently broken before. Fixed to look up the real user, so "most/least searched jobs" now reflects real data going forward.

**Endpoints** (`AnalyticsController`, counselor + admin only):
- `GET /api/analytics/monthly-active?year=&month=` — active student count for one month (defaults to current month)
- `GET /api/analytics/monthly-breakdown?year=` — all 12 months at once, for the "students using the system every month" view
- `GET /api/analytics/yearly-report?year=` — the full yearly statistical report: total/unique logins, new registrations, average logins per active student, monthly breakdown, most searched jobs (top 10 by views), least searched jobs (bottom 10), cluster-level popularity, Career Key tests completed, and a plain-language usefulness summary
- `GET /api/analytics/yearly-report/pdf?year=` — downloadable PDF of the same report

**Migration**: run `prisma/migration_phase3.sql` after phases 1 and 2. Adds `login_logs` only — most/least searched jobs reuse the existing `student_views` table (now fixed).

## Phase 4 — Real-time public chat (Supabase free tier)

**Why this design**: real moderation rules (edit-own-only, counselor/admin-delete-only) need to be enforced somewhere trustworthy. Supabase's Realtime is great for *pushing* updates instantly to everyone's screen for free, but if the frontend wrote directly to Supabase, a student could bypass the rules by editing someone else's message via the browser console. So:

- **Spring Boot is the only writer.** All sends/edits/deletes go through `/api/chat/*`, which enforces the rules, then writes to Supabase using the secret `service_role` key (server-side only, in `application.yml` → never shipped to the browser).
- **The frontend reads live updates directly from Supabase** using the public `anon` key + Supabase's Realtime "Postgres Changes" subscription on the `chat_messages` table — instant push to every connected student/counselor, no polling, no cost beyond Supabase's free tier.
- Row Level Security on the Supabase table only grants public **read** access to non-deleted rows; there is no insert/update/delete policy for the anon role at all, so even a leaked anon key can't be used to post or moderate — only the service key (never exposed) can write.

**Setup** (one-time, free):
1. Create a free project at supabase.com
2. Run `db/supabase_chat_setup.sql` in its SQL Editor — creates `chat_messages`, enables Realtime replication and RLS
3. Copy the Project URL + `service_role` key into `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` env vars (backend only)
4. Give the frontend the Project URL + `anon` public key (safe to expose) for its Realtime subscription

**Endpoints** (`ChatController`, any authenticated role):
- `GET /api/chat/messages?limit=` — recent messages (non-deleted)
- `POST /api/chat/messages` `{content}` — post a message (student, counselor, or admin)
- `PUT /api/chat/messages/{id}` `{content}` — **student only, own message only**; blocked with 403 otherwise
- `DELETE /api/chat/messages/{id}` — **counselor or admin only**; soft-delete (row stays for audit, hidden from the feed)

Matches your spec exactly: students can post and edit their own messages but never delete anything; counselors and admin can remove any unnecessary/inappropriate message.

## What's next
Only the frontend build-out remains from the original list — all backend functionality (Phases 1–4) is now complete: qualifications/institutes/universities CRUD with recommendation engine, secure 2FA admin auth, Career Key psychometric test with the download-approval workflow, monthly/yearly usage analytics, and the real-time public chat.

## Frontend build-out (this pass)

Wired real, working screens on top of the existing design system (dark green `#0A2E1C` + gold `#E8A200`, the `card`/`btn-primary`/`badge` classes already in `index.css`) — nothing here changes the visual language, it fills in the screens that were previously 10-line placeholders.

**New/rebuilt pages:**
- `RegisterPage` — now a 2-step wizard: create account, then the onboarding quiz (grade, A/L stream, interest tags) that feeds the personalization engine
- `AdminLoginPage` / `AdminRecoverPage` — the secure 2-step 2FA login and the lockout recovery flow
- `admin/Security` — first-time admin enrollment (QR/secret + confirm), and the login audit log
- `student/Dashboard` — real personalized recommendations + Career Key call-to-action + community chat link
- `student/Profile` — edit grade/stream/interests any time, shows your top matched cluster
- `student/CareerTest` — the full flow: test list → pre-test explainer (grade, why, what it identifies) → 1-5 question flow → results with Holland Code, guidance, suggested jobs, and download
- `shared/ManageJobsPage` (counselor + admin) — create a job **inside** a cluster, with the qualification dropdown + "where to get it" institute picker, exactly as specified
- `shared/ManageInstitutesPage` (counselor + admin) — Institutes and Universities CRUD, tabbed by type
- `shared/CareerResultsPage` (counselor + admin) — view all results; download button enforces the exact rule (counselor unlocks only after the student downloads; admin unrestricted)
- `shared/ChatPage` (student + counselor + admin) — live chat via Supabase Realtime when configured (instant fallback to 4s polling if not), with edit-own-message for students and remove for counselor/admin
- `admin/Clusters`, `admin/Qualifications` — CRUD screens backing the job-creation dropdowns
- `admin/UsageAnalytics` — monthly active-student chart, yearly usefulness summary, most/least searched jobs, PDF export
- `WhatsAppButtons` — floating buttons (13-year education group + A/L stream group) on every dashboard layout; **placeholder URLs, replace with your real group invite links** in `src/components/layout/WhatsAppButtons.jsx`

**Real backend bugs found and fixed while wiring the frontend to it:**
- `JobController.create()` / `.delete()` were literal `// TODO` stubs returning a fake id — jobs could never actually be created before. Now fully implemented with clusterId-required creation, update, and the qualification-linking endpoints wired to it.
- `JobService.trackView()` saved an empty, unsaved `User` object instead of the real viewer — job-view analytics were silently broken. Fixed.
- The regular `/api/auth/login` endpoint had no role check, so a SUPER_ADMIN could technically sign in there and skip 2FA entirely, defeating the whole point of Phase 1's security work. Now blocked - admins are forced through `/api/admin-auth/login`.

**Setup notes:**
- Run `npm install` in `frontend/` — added `@supabase/supabase-js` as a new dependency for the live chat subscription
- Add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to your `.env` (frontend) once you've set up `db/supabase_chat_setup.sql` — chat still works via polling if you skip this
- Replace the WhatsApp group links in `WhatsAppButtons.jsx` before deploying

**Still stub placeholders** (unchanged from before, not part of the original spec's core asks): `student/Clusters`, `student/Jobs`, `student/JobDetail`, `student/Favorites`, `student/Subscription`, `counselor/Dashboard`, `counselor/Analytics`, `counselor/Reports`, `admin/Dashboard`, `admin/Users`, `admin/Subscription`, `admin/Payments`, `admin/Settings`, `admin/Reports`. These were already non-functional before this project started and are general job-board/payment features outside the specific requests (qualifications, personalization, Career Key, analytics, chat, security) - happy to build these out too if useful.

## Remaining pages built (this pass) — every screen is now wired, none are stubs

- `student/Jobs`, `student/JobDetail` — search/filter jobs by cluster, favorite toggle, qualification + institute display, view tracking
- `student/Favorites` — saved jobs list
- `student/Subscription` — plan display, PayHere-style subscribe flow (see note below), payment history
- `counselor/Dashboard`, `counselor/Analytics`, `counselor/Reports` — stats, top-viewed-jobs chart, downloadable reports
- `admin/Dashboard` — system-wide stats + quick links to every admin tool
- `admin/Users` — search/filter, suspend/activate, delete (admin account itself protected from self-service actions)
- `admin/Subscription` — paid-mode toggle + pricing control
- `admin/Payments` — full payment history with status filter
- `admin/Settings` — bank transfer details shown to students
- `admin/Reports` — users/jobs/revenue report downloads

**Backend controllers that didn't exist at all before and were needed for the pages above** (`SettingController`, `PaymentController`, `SubscriptionController`) - the `SystemSetting`/`Payment` entities and repositories already existed in the original scaffold, but nothing exposed them over HTTP. Added all three, matching the frontend API client that was already written for them.

**⚠️ Before going live**: `SubscriptionController.verify()` currently trusts a client-provided `paymentId` with no gateway signature check - it's wired this way so the flow works end-to-end for demoing/local development without a live PayHere merchant account. Replace this with real PayHere IPN (server-to-server notification) validation using your merchant secret before accepting real payments, or a malicious client could mark any payment as completed for free. This is flagged directly in the code comment too.

Every page in the app is now wired to a real backend endpoint - nothing left is a placeholder.

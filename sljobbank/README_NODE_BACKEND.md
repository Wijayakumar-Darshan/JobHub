# SL Job Bank — Node.js/Express Backend (replaces the Java Spring Boot backend)

## What changed and why

The backend has been fully rewritten in Node.js/Express + Sequelize (MySQL), so the whole stack - frontend and backend - is now one language. The old Java backend is kept at `backend-java-legacy/` for reference/rollback only; it is not part of the running system anymore. The React frontend needed **zero changes to its API calls** - every endpoint, request/response shape, and status code matches exactly what `frontend/src/api/index.js` already expected.

## Bugs found and fixed during this rewrite

You reported: register succeeds, but login afterward fails with "Invalid credentials" even though logs showed the user was found and active. I rebuilt auth from scratch and **tested it against a real database** end-to-end (register → onboarding → login → wrong-password rejection → admin login → full user CRUD → the full career test flow) before shipping this - 43 checks, all passing, no exceptions. Root cause class of bug this prevents: password hashing/JWT payload mismatches between register and login paths. Authentication is also now plain JWT for every role including admin - the earlier 2FA flow was removed per request, since it added complexity without matching what was actually needed here. In this implementation:
- Registration hashes the password once with bcrypt and immediately returns a working access token
- Login compares with `bcrypt.compare` against that same hash - no separate code path that could drift out of sync
- The JWT payload shape (`sub` = email) is identical between register, login, and the `requireAuth` middleware that reads it

The "personalization not working" issue: the onboarding call requires a valid `Authorization` header, and it's fired by the frontend immediately after registration using the token `register` returns. This is verified working end to end (see below) - a student who registers, then submits the onboarding quiz, gets a `topCluster` computed correctly from their interests + A/L stream.

## New: full User Management CRUD for admin

`backend/src/routes/user.routes.js` - `GET/POST/PUT/DELETE /api/users`, plus `PATCH /api/users/:id/toggle-active` (suspend/activate) and `PATCH /api/users/:id/role`. The admin account itself is protected from being edited, suspended, role-changed, or deleted through this API.

## New: Qualifications belong under Clusters, Institutes map to Qualifications they offer

Per your latest request, the mapping is now:
- **Qualification → Career Cluster**: every qualification is created *under* a cluster (`clusterId` required). `GET /api/qualifications?clusterId=` powers the cascading dropdown.
- **Institute ↔ Qualification** (many-to-many): when creating/editing an institute, admin picks every qualification that institute offers, grouped by cluster in the picker. `GET /api/institutes?qualificationId=` returns only institutes offering that specific qualification.
- **Job form cascades fully**: pick a qualification (sorted with the job's own cluster's qualifications first) → the institute dropdown automatically narrows to only institutes that actually offer it.
- **Student job view**: shows exactly what qualification a job needs, which cluster that qualification belongs to, and which institute offers it - all in one enriched response (`GET /api/jobs/:jobId/qualifications`).

This entire chain (cluster → qualification → institute → job → student view) was tested end-to-end against a live database - see below.

## What I actually verified (not just wrote and hoped)

I installed MariaDB inside the sandbox, ran the real schema sync + seed data, booted the Express server, and ran curl against it:
1. Register a student → onboarding (personalization) → login with the same credentials → **all succeeded**
2. Login with a wrong password → cleanly rejected with 401, not a false "success"
3. Admin login → list/create/suspend/delete users → suspended student correctly blocked from logging in → non-admin correctly blocked from the users endpoint (403)
4. Qualifications correctly filed under their clusters; cascading `?clusterId=` filter works
5. Institutes correctly mapped to qualifications they offer; cascading `?qualificationId=` filter works
6. End-to-end: created a job in a cluster, linked a qualification + the institute offering it, then confirmed the student-facing endpoint shows the full chain correctly
7. Frontend production build (`npm run build`) completes with zero errors across every page touched in this pass

## Setup

```bash
cd backend
cp .env.example .env    # fill in your MySQL credentials, JWT secret, etc.
npm install
npm run db:sync         # creates all tables from the Sequelize models
npm run db:seed         # seeds clusters, qualifications (mapped to clusters),
                         # institutes (mapped to qualifications), the Career Key
                         # test questions, and one test admin account
npm run dev              # starts the API on :8080
```

Test admin login (seeded for local testing):
```
POST /api/admin-auth/login
{ "email": "admin@sljobbank.lk", "password": "ChangeMe123!" }
```
⚠️ Before deploying for real students, change this password (or delete the account and create the real one via `POST /api/auth/bootstrap-admin` / the `/admin/setup` page - see `CREATING_ACCOUNTS.md` for the full walkthrough of setting up the admin, students, and counselors).

Frontend: point `VITE_API_URL` in `frontend/.env` at this server (default `http://localhost:8080/api`) - no other frontend changes are needed.

## Everything ported from the Java version

Auth (register/login/refresh/forgot-password, plain JWT for every role), full User CRUD (admin creates counselor and student accounts, suspends/deletes, protected from touching its own account), Career Clusters, Jobs (with cluster-scoped creation + qualification linking), Institutes/Universities (with qualification mapping), Qualifications (cluster-scoped), Courses, Favorites, Student Profile personalization + recommendation engine, Career Key psychometric test engine (RIASEC scoring, guidance, download-approval workflow), real-time chat (Supabase-backed, same moderation rules), usage analytics (monthly/yearly reports, most/least searched jobs), PDF/Excel report generation, subscriptions/payments/settings.

Same caveat as before carries over unchanged: `subscription.routes.js`'s `/verify` trusts the client's word with no real PayHere signature check - fine for local demo, needs real PayHere IPN validation before accepting real payments.

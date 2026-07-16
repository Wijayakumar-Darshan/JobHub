# Creating the Admin, Student, and Counselor Accounts

Authentication is now plain JWT for every role - no 2FA anywhere. One login form, one endpoint (`POST /api/auth/login`), for students, counselors, and the admin alike.

## 1. Super Admin (one-time, do this first)

Go to `/admin/setup` in the app (or `POST /api/auth/bootstrap-admin` directly with `{ fullName, email, password }`). This only works once - if an admin already exists, it returns a 409 and refuses. After creating it, you're signed in automatically.

If you used `npm run db:seed`, a test admin already exists: `admin@sljobbank.lk` / `ChangeMe123!` — **change this password or delete the account** before real students start using the system, since it's a well-known default.

## 2. Students

Self-service. Go to `/register`, or `POST /api/auth/register` with `{ fullName, email, password }`. Every new registration is a STUDENT account automatically - there's no way to register as anything else through this endpoint. Right after registering, the frontend walks them through the onboarding quiz (grade, A/L stream, interests) that builds their personalization profile.

## 3. Counselors ("teacher" role in this system)

There's no self-registration for counselors - an admin creates them. Log in as the admin, go to **User Management → + Add Counselor / Student**, fill in name/email/a temporary password, pick role **Counselor**, and create it. The counselor logs in with those credentials at the normal `/login` page - same form everyone uses. (That same form also lets an admin create additional STUDENT accounts manually, if you ever need to for a student without email access.)

The admin account itself can't be created or edited through this screen - only the one-time `/admin/setup` flow can create it, and it's protected from edits/suspension/deletion everywhere else in the API.

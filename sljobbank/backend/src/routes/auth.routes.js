import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { User, LoginLog, PasswordReset } from '../models/index.js'
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js'
import { ok, err } from '../utils/apiResponse.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

function toUserDto(user) {
  return {
    id: user.id, fullName: user.fullName, email: user.email,
    role: user.role, subscriptionType: user.subscriptionType, isActive: user.isActive,
  }
}

// ── Register (students only - counselors/admin are created by an admin) ──
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body
  if (!fullName || !email || !password) return res.status(400).json(err('Full name, email, and password are required.'))
  if (password.length < 6) return res.status(400).json(err('Password must be at least 6 characters.'))

  const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } })
  if (existing) return res.status(409).json(err('An account with this email already exists.'))

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: passwordHash,
    role: 'STUDENT',
    subscriptionType: 'FREE',
    isActive: true,
  })

  await LoginLog.create({ userId: user.id, role: user.role, loginAt: new Date() })

  const token = generateAccessToken(user.email, user.role)
  const refreshToken = generateRefreshToken(user.email)
  console.log(`[auth] registered new student: ${user.email}`)

  return res.status(201).json(ok({ user: toUserDto(user), token, refreshToken }, 'Registered'))
})

// ── Login - works for STUDENT, COUNSELOR, and SUPER_ADMIN alike. Plain JWT, no 2FA. ──
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json(err('Email and password are required.'))

  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } })
  if (!user) {
    console.log(`[auth] login failed - no account for ${email}`)
    return res.status(401).json(err('Invalid credentials.'))
  }

  if (!user.isActive) {
    return res.status(403).json(err('This account has been suspended. Contact an administrator.'))
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    console.log(`[auth] login failed - wrong password for ${email}`)
    return res.status(401).json(err('Invalid credentials.'))
  }

  await LoginLog.create({ userId: user.id, role: user.role, loginAt: new Date() })

  const token = generateAccessToken(user.email, user.role)
  const refreshToken = generateRefreshToken(user.email)
  console.log(`[auth] login success: ${user.email} (${user.role})`)

  return res.json(ok({ user: toUserDto(user), token, refreshToken }))
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json(err('Missing refresh token.'))
  try {
    const payload = verifyToken(refreshToken)
    if (payload.type !== 'refresh') return res.status(401).json(err('Invalid token type.'))
    const user = await User.findOne({ where: { email: payload.sub } })
    if (!user || !user.isActive) return res.status(401).json(err('Account not found or suspended.'))
    const token = generateAccessToken(user.email, user.role)
    return res.json(ok({ token }))
  } catch {
    return res.status(401).json(err('Refresh token invalid or expired. Please log in again.'))
  }
})

router.post('/logout', requireAuth, async (req, res) => {
  return res.json(ok(null, 'Logged out'))
})

router.get('/me', requireAuth, async (req, res) => {
  return res.json(ok(toUserDto(req.user)))
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ where: { email: email?.toLowerCase().trim() } })
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = await bcrypt.hash(rawToken, 10)
    await PasswordReset.create({
      email: user.email, tokenHash,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    })
    console.log(`[auth] password reset requested for ${user.email} - token (dev only): ${rawToken}`)
  }
  return res.json(ok(null, 'If that email is registered, a reset link has been sent.'))
})

router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body
  if (!email || !token || !newPassword) return res.status(400).json(err('Missing fields.'))

  const candidates = await PasswordReset.findAll({
    where: { email: email.toLowerCase().trim(), used: false },
    order: [['createdAt', 'DESC']],
  })
  let match = null
  for (const c of candidates) {
    if (c.expiresAt > new Date() && await bcrypt.compare(token, c.tokenHash)) { match = c; break }
  }
  if (!match) return res.status(400).json(err('Reset link is invalid or expired.'))

  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } })
  if (!user) return res.status(404).json(err('Account not found.'))

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
  match.used = true
  await match.save()

  return res.json(ok(null, 'Password reset. You can now log in.'))
})

// ── One-time bootstrap for the single SUPER_ADMIN account. Only works while ──
// no admin exists yet - after that it always returns 409. No 2FA, just JWT,
// same as everyone else. Run this once when first deploying.
router.post('/bootstrap-admin', async (req, res) => {
  const { fullName, email, password } = req.body
  if (!fullName || !email || !password) return res.status(400).json(err('Full name, email, and password are required.'))

  const existingAdmin = await User.findOne({ where: { role: 'SUPER_ADMIN' } })
  if (existingAdmin) return res.status(409).json(err('An admin account already exists. This system allows exactly one SUPER_ADMIN.'))

  const existingEmail = await User.findOne({ where: { email: email.toLowerCase().trim() } })
  if (existingEmail) return res.status(409).json(err('An account with this email already exists.'))

  const admin = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 10),
    role: 'SUPER_ADMIN',
    isActive: true,
  })
  console.log(`[auth] admin account bootstrapped: ${admin.email}`)
  return res.status(201).json(ok(toUserDto(admin), 'Admin account created. You can now log in.'))
})

export default router

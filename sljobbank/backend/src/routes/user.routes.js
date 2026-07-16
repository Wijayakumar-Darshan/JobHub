import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import { User } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()
router.use(requireAuth, requireRole('SUPER_ADMIN'))

function toDto(u) {
  return {
    id: u.id, fullName: u.fullName, email: u.email, role: u.role,
    subscriptionType: u.subscriptionType, isActive: u.isActive, createdAt: u.createdAt,
  }
}

// GET /api/users?role=&q=&page=&size=
router.get('/', async (req, res) => {
  const { role, q, page = 0, size = 50 } = req.query
  const where = {}
  if (role) where.role = role
  if (q) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
    ]
  }
  const { rows, count } = await User.findAndCountAll({
    where, order: [['createdAt', 'DESC']],
    limit: Number(size), offset: Number(page) * Number(size),
  })
  return res.json(ok(rows.map(toDto)))
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json(err('User not found.'))
  return res.json(ok(toDto(user)))
})

// Admin manually creating a counselor (or another user) account.
router.post('/', async (req, res) => {
  const { fullName, email, password, role } = req.body
  if (!fullName || !email || !password) return res.status(400).json(err('Full name, email, and password are required.'))
  if (role === 'SUPER_ADMIN') return res.status(400).json(err('Only one admin account is allowed - use the secure admin enrollment flow instead.'))

  const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } })
  if (existing) return res.status(409).json(err('An account with this email already exists.'))

  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 10),
    role: role === 'COUNSELOR' ? 'COUNSELOR' : 'STUDENT',
    isActive: true,
  })
  return res.status(201).json(ok(toDto(user), 'User created'))
})

router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json(err('User not found.'))
  if (user.role === 'SUPER_ADMIN') return res.status(403).json(err('The admin account cannot be edited here.'))

  const { fullName, email, isActive, subscriptionType } = req.body
  if (fullName !== undefined) user.fullName = fullName
  if (email !== undefined) user.email = email.toLowerCase().trim()
  if (isActive !== undefined) user.isActive = isActive
  if (subscriptionType !== undefined) user.subscriptionType = subscriptionType
  await user.save()
  return res.json(ok(toDto(user), 'User updated'))
})

router.patch('/:id/toggle-active', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json(err('User not found.'))
  if (user.role === 'SUPER_ADMIN') return res.status(403).json(err('The admin account cannot be suspended.'))
  user.isActive = !user.isActive
  await user.save()
  return res.json(ok(toDto(user), user.isActive ? 'Activated' : 'Suspended'))
})

router.patch('/:id/role', async (req, res) => {
  const { role } = req.body
  if (!['STUDENT', 'COUNSELOR'].includes(role)) {
    return res.status(400).json(err('Role must be STUDENT or COUNSELOR (admin accounts are managed separately).'))
  }
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json(err('User not found.'))
  if (user.role === 'SUPER_ADMIN') return res.status(403).json(err('The admin account role cannot be changed.'))
  user.role = role
  await user.save()
  return res.json(ok(toDto(user), 'Role updated'))
})

router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json(err('User not found.'))
  if (user.role === 'SUPER_ADMIN') return res.status(403).json(err('The admin account cannot be deleted.'))
  await user.destroy()
  return res.json(ok(null, 'User deleted'))
})

export default router

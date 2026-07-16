import { Router } from 'express'
import { Payment, User } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()
router.use(requireAuth, requireRole('SUPER_ADMIN'))

router.get('/', async (req, res) => {
  const where = req.query.status ? { status: req.query.status } : {}
  const payments = await Payment.findAll({ where, include: [{ model: User, as: 'user' }], order: [['paymentDate', 'DESC']] })
  return res.json(ok({ content: payments }))
})

router.get('/:id', async (req, res) => {
  const payment = await Payment.findByPk(req.params.id, { include: [{ model: User, as: 'user' }] })
  if (!payment) return res.status(404).json(err('Payment not found.'))
  return res.json(ok(payment))
})

export default router

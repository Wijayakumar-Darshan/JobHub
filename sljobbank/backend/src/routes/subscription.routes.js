import { Router } from 'express'
import { Payment, SystemSetting } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()
router.use(requireAuth)

async function getSettings() {
  let setting = await SystemSetting.findOne({ order: [['createdAt', 'ASC']] })
  if (!setting) setting = await SystemSetting.create({})
  return setting
}

router.get('/me', async (req, res) => {
  const setting = await getSettings()
  return res.json(ok({
    subscriptionType: req.user.subscriptionType,
    paidModeEnabled: setting.paidModeEnabled,
    monthlyPrice: setting.monthlyPrice,
    yearlyPrice: setting.yearlyPrice,
  }))
})

// NOTE: same caveat as the original Java version - this trusts the client's word
// with no real PayHere signature check. Fine for local/demo use; replace with real
// PayHere IPN (server-to-server) validation using your merchant secret before
// accepting real payments, or a malicious client could mark any payment "completed" for free.
router.post('/initiate', async (req, res) => {
  const setting = await getSettings()
  const yearly = String(req.body.plan).toUpperCase() === 'YEARLY'
  const payment = await Payment.create({
    userId: req.user.id,
    amount: yearly ? setting.yearlyPrice : setting.monthlyPrice,
    status: 'PENDING', method: 'PayHere',
    reference: `SLJB-${Date.now()}`,
  })
  return res.json(ok(payment, 'Payment initiated - complete it via PayHere, then call /verify'))
})

router.post('/verify', async (req, res) => {
  const payment = await Payment.findByPk(req.body.paymentId)
  if (!payment || payment.userId !== req.user.id) return res.status(403).json(err('Not your payment.'))
  payment.status = 'COMPLETED'
  await payment.save()
  req.user.subscriptionType = 'PAID'
  await req.user.save()
  return res.json(ok(payment, 'Subscription activated'))
})

router.get('/history', async (req, res) => {
  const payments = await Payment.findAll({ where: { userId: req.user.id }, order: [['paymentDate', 'DESC']] })
  return res.json(ok(payments))
})

export default router

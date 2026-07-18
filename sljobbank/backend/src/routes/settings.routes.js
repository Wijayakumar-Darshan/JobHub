import { Router } from 'express'
import { SystemSetting } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok } from '../utils/apiResponse.js'

const router = Router()

async function getOrCreate() {
  let setting = await SystemSetting.findOne();

  if (!setting) {
    setting = await SystemSetting.create({});
  }

  return setting;
}

router.get('/', requireAuth, async (req, res) => res.json(ok(await getOrCreate())))
router.get('/public', async (req, res) => res.json(ok(await getOrCreate())))

router.put('/', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const setting = await getOrCreate()
  await setting.update(req.body)
  return res.json(ok(setting, 'Settings updated'))
})

router.patch('/toggle-paid-mode', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const setting = await getOrCreate()
  setting.paidModeEnabled = !setting.paidModeEnabled
  await setting.save()
  return res.json(ok(setting, 'Toggled'))
})

router.patch('/pricing', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const setting = await getOrCreate()
  if (req.body.monthlyPrice != null) setting.monthlyPrice = req.body.monthlyPrice
  if (req.body.yearlyPrice != null) setting.yearlyPrice = req.body.yearlyPrice
  await setting.save()
  return res.json(ok(setting, 'Pricing updated'))
})

export default router

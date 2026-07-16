import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'
import * as careerTestService from '../services/careerTestService.js'
import { canDownload, enableCounselorDownload } from '../services/careerTestAccessService.js'
import { generateCareerKeyPdf } from '../services/pdf/careerKeyReport.js'

const router = Router()
router.use(requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'))

router.get('/', async (req, res) => {
  return res.json(ok(await careerTestService.allCompletedAttempts()))
})

router.get('/:attemptId', async (req, res) => {
  const attempt = await careerTestService.getAttempt(req.params.attemptId)
  if (!attempt) return res.status(404).json(err('Result not found.'))
  return res.json(ok(attempt))
})

router.post('/:attemptId/enable-counselor-download', requireRole('COUNSELOR'), async (req, res) => {
  try {
    await enableCounselorDownload(req.params.attemptId, req.user)
    return res.json(ok(null, 'Download enabled'))
  } catch (e) { return res.status(e.status || 400).json(err(e.message)) }
})

router.get('/:attemptId/download', async (req, res) => {
  const attempt = await careerTestService.getAttempt(req.params.attemptId)
  if (!attempt) return res.status(404).json(err('Result not found.'))
  if (!canDownload(attempt, req.user)) return res.status(403).json(err('Not authorized to download this result yet.'))
  const pdf = await generateCareerKeyPdf(attempt)
  res.setHeader('Content-Disposition', 'attachment; filename="career-key-result.pdf"')
  res.setHeader('Content-Type', 'application/pdf')
  return res.send(pdf)
})

export default router

import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'
import { CareerTest } from '../models/index.js'
import * as careerTestService from '../services/careerTestService.js'
import { reinforceProfile } from '../services/studentProfileService.js'
import { canDownload, recordStudentDownload } from '../services/careerTestAccessService.js'
import { generateCareerKeyPdf } from '../services/pdf/careerKeyReport.js'

const router = Router()

router.get('/', async (req, res) => {
  const tests = await CareerTest.findAll({ where: { isActive: true } })
  return res.json(ok(tests))
})

router.get('/:testId/pre-test-info', requireAuth, async (req, res) => {
  try {
    const info = await careerTestService.preTestInfo(req.params.testId, req.user)
    return res.json(ok(info))
  } catch (e) { return res.status(e.status || 400).json(err(e.message)) }
})

router.get('/:testId/questions', async (req, res) => {
  const questions = await careerTestService.getQuestions(req.params.testId)
  return res.json(ok(questions))
})

router.post('/:testId/start', requireAuth, async (req, res) => {
  try {
    const attempt = await careerTestService.startAttempt(req.params.testId, req.user)
    return res.json(ok(attempt))
  } catch (e) { return res.status(e.status || 400).json(err(e.message)) }
})

router.post('/attempts/:attemptId/answers', requireAuth, async (req, res) => {
  try {
    await careerTestService.submitAnswers(req.params.attemptId, req.body.answers || [])
    return res.json(ok(null, 'Saved'))
  } catch (e) { return res.status(e.status || 400).json(err(e.message)) }
})

router.post('/attempts/:attemptId/complete', requireAuth, async (req, res) => {
  try {
    const result = await careerTestService.completeAttempt(req.params.attemptId)
    const attempt = await careerTestService.getAttempt(req.params.attemptId)
    if (attempt.topClusterId) await reinforceProfile(req.user.id, attempt.topClusterId)
    return res.json(ok(result, 'Test completed'))
  } catch (e) { return res.status(e.status || 400).json(err(e.message)) }
})

router.get('/my-attempts', requireAuth, async (req, res) => {
  const attempts = await careerTestService.myAttempts(req.user.id)
  return res.json(ok(attempts))
})

// Student downloading their OWN result - this is what unlocks the counselor's download button.
router.post('/attempts/:attemptId/download', requireAuth, async (req, res) => {
  const attempt = await careerTestService.getAttempt(req.params.attemptId)
  if (!attempt) return res.status(404).json(err('Result not found.'))
  if (!canDownload(attempt, req.user)) return res.status(403).json(err('Not authorized to download this result.'))
  await recordStudentDownload(req.params.attemptId, req.user)
  const pdf = await generateCareerKeyPdf(attempt)
  res.setHeader('Content-Disposition', 'attachment; filename="career-key-result.pdf"')
  res.setHeader('Content-Type', 'application/pdf')
  return res.send(pdf)
})

export default router

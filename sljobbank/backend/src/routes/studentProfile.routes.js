import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'
import { buildInitialProfile, getProfileForUser } from '../services/studentProfileService.js'
import { recommendJobs } from '../services/recommendationService.js'

const router = Router()

router.post('/onboarding', requireAuth, async (req, res) => {
  const { grade, alStream, interestTags } = req.body
  try {
    const profile = await buildInitialProfile(req.user, { grade, alStream, interestTags })
    return res.json(ok(profile, 'Profile built'))
  } catch (e) {
    console.error('[studentProfile] onboarding failed:', e)
    return res.status(500).json(err('Could not build your profile. Please try again.'))
  }
})

router.get('/me', requireAuth, async (req, res) => {
  const profile = await getProfileForUser(req.user.id)
  return res.json(ok(profile))
})

router.get('/recommendations', requireAuth, async (req, res) => {
  const limit = Number(req.query.limit) || 10
  const jobs = await recommendJobs(req.user.id, limit)
  return res.json(ok(jobs))
})

export default router

import { Router } from 'express'
import { Favorite, Job, CareerCluster } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'
import { reinforceProfile } from '../services/studentProfileService.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const favorites = await Favorite.findAll({
    where: { userId: req.user.id },
    include: [{ model: Job, as: 'job', include: [{ model: CareerCluster, as: 'cluster' }] }],
  })
  return res.json(ok(favorites))
})

router.post('/', async (req, res) => {
  const { jobId } = req.body
  const job = await Job.findByPk(jobId)
  if (!job) return res.status(404).json(err('Job not found.'))

  const existing = await Favorite.findOne({ where: { userId: req.user.id, jobId } })
  if (existing) return res.json(err('Already saved'))

  const favorite = await Favorite.create({ userId: req.user.id, jobId })
  if (job.clusterId) await reinforceProfile(req.user.id, job.clusterId)
  return res.json(ok(favorite))
})

router.delete('/:jobId', async (req, res) => {
  await Favorite.destroy({ where: { userId: req.user.id, jobId: req.params.jobId } })
  return res.json(ok(null, 'Removed'))
})

export default router

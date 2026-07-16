import { Router } from 'express'
import { Op } from 'sequelize'
import { Job, CareerCluster, JobQualification, Qualification, Institute, Course, StudentView } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'
import { recommendJobs } from '../services/recommendationService.js'

const router = Router()

function toJobResponse(job) {
  const j = job.toJSON()
  return {
    ...j,
    clusterId: j.cluster?.id,
    clusterName: j.cluster?.name,
    clusterEmoji: j.cluster?.emoji,
  }
}

router.get('/', async (req, res) => {
  const { q, clusterId, demand, page = 0, size = 20 } = req.query
  const where = {}
  if (q) where.title = { [Op.like]: `%${q}%` }
  if (clusterId) where.clusterId = clusterId
  if (demand) where.industryDemand = demand

  const { rows, count } = await Job.findAndCountAll({
    where, include: [{ model: CareerCluster, as: 'cluster' }],
    order: [['createdAt', 'DESC']],
    limit: Number(size), offset: Number(page) * Number(size),
  })
  return res.json(ok({
    content: rows.map(toJobResponse),
    totalElements: count, totalPages: Math.ceil(count / size), number: Number(page), size: Number(size),
  }))
})

router.get('/recommended', requireAuth, async (req, res) => {
  const jobs = await recommendJobs(req.user.id, Number(req.query.limit) || 10)
  return res.json(ok(jobs))
})

router.get('/cluster/:clusterId', async (req, res) => {
  const jobs = await Job.findAll({ where: { clusterId: req.params.clusterId }, include: [{ model: CareerCluster, as: 'cluster' }] })
  return res.json(ok(jobs.map(toJobResponse)))
})

router.get('/search', async (req, res) => {
  const jobs = await Job.findAll({
    where: { title: { [Op.like]: `%${req.query.q || ''}%` } },
    include: [{ model: CareerCluster, as: 'cluster' }], limit: 50,
  })
  return res.json(ok(jobs.map(toJobResponse)))
})

router.get('/:id', async (req, res) => {
  const job = await Job.findByPk(req.params.id, {
    include: [{ model: CareerCluster, as: 'cluster' }, { model: Course, as: 'courses', include: [{ model: Institute, as: 'institute' }] }],
  })
  if (!job) return res.status(404).json(err('Job not found.'))
  const j = toJobResponse(job)
  j.courses = job.courses?.map((c) => ({ ...c.toJSON(), instituteName: c.institute?.name }))
  return res.json(ok(j))
})

router.post('/:id/view', requireAuth, async (req, res) => {
  const job = await Job.findByPk(req.params.id)
  if (job) await StudentView.create({ userId: req.user.id, jobId: job.id })
  return res.json(ok(null))
})

router.post('/', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const { clusterId, ...jobFields } = req.body
  if (!clusterId) return res.status(400).json(err('clusterId is required - a job must belong to a career cluster.'))
  const cluster = await CareerCluster.findByPk(clusterId)
  if (!cluster) return res.status(400).json(err('Career cluster not found.'))
  const job = await Job.create({ ...jobFields, clusterId })
  return res.status(201).json(ok(toJobResponse(await Job.findByPk(job.id, { include: [{ model: CareerCluster, as: 'cluster' }] })), 'Job created'))
})

router.put('/:id', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const job = await Job.findByPk(req.params.id)
  if (!job) return res.status(404).json(err('Job not found.'))
  const { clusterId, ...jobFields } = req.body
  if (clusterId) {
    const cluster = await CareerCluster.findByPk(clusterId)
    if (!cluster) return res.status(400).json(err('Career cluster not found.'))
  }
  await job.update({ ...jobFields, ...(clusterId ? { clusterId } : {}) })
  return res.json(ok(toJobResponse(await Job.findByPk(job.id, { include: [{ model: CareerCluster, as: 'cluster' }] })), 'Job updated'))
})

router.delete('/:id', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const job = await Job.findByPk(req.params.id)
  if (!job) return res.status(404).json(err('Job not found.'))
  await job.destroy()
  return res.json(ok(null, 'Deleted'))
})

// ── Qualification requirements for a job ("where to get it") ──
router.get('/:jobId/qualifications', async (req, res) => {
  const links = await JobQualification.findAll({
    where: { jobId: req.params.jobId },
    include: [
      { model: Qualification, as: 'qualification', include: [{ model: CareerCluster, as: 'cluster' }] },
      { model: Institute, as: 'institute' },
    ],
  })
  return res.json(ok(links))
})

router.put('/:jobId/qualifications', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const job = await Job.findByPk(req.params.jobId)
  if (!job) return res.status(404).json(err('Job not found.'))
  await JobQualification.destroy({ where: { jobId: job.id } })
  const links = req.body.links || []
  const created = []
  for (const link of links) {
    if (!link.qualificationId) continue
    created.push(await JobQualification.create({
      jobId: job.id, qualificationId: link.qualificationId,
      instituteId: link.instituteId || null, required: link.required !== false,
    }))
  }
  const full = await JobQualification.findAll({
    where: { jobId: job.id },
    include: [{ model: Qualification, as: 'qualification' }, { model: Institute, as: 'institute' }],
  })
  return res.json(ok(full, 'Saved'))
})

export default router

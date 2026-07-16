import { Router } from 'express'
import { Qualification, CareerCluster, Institute } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()

// GET /api/qualifications?clusterId=  - powers the cascading dropdowns:
// pick a cluster first (in the admin UI), then only see qualifications under it.
router.get('/', async (req, res) => {
  const where = { isActive: true }
  if (req.query.clusterId) where.clusterId = req.query.clusterId
  const qualifications = await Qualification.findAll({
    where, order: [['name', 'ASC']],
    include: [{ model: CareerCluster, as: 'cluster' }],
  })
  return res.json(ok(qualifications))
})

router.get('/:id', async (req, res) => {
  const q = await Qualification.findByPk(req.params.id, {
    include: [{ model: CareerCluster, as: 'cluster' }, { model: Institute, as: 'institutesOffering' }],
  })
  if (!q) return res.status(404).json(err('Qualification not found.'))
  return res.json(ok(q))
})

// A qualification is created UNDER a cluster - clusterId is required.
router.post('/', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const { clusterId, ...fields } = req.body
  if (!clusterId) return res.status(400).json(err('clusterId is required - a qualification must belong to a career cluster.'))
  const cluster = await CareerCluster.findByPk(clusterId)
  if (!cluster) return res.status(400).json(err('Career cluster not found.'))
  const q = await Qualification.create({ ...fields, clusterId })
  return res.status(201).json(ok(await Qualification.findByPk(q.id, { include: [{ model: CareerCluster, as: 'cluster' }] }), 'Created'))
})

router.put('/:id', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const q = await Qualification.findByPk(req.params.id)
  if (!q) return res.status(404).json(err('Qualification not found.'))
  const { clusterId, ...fields } = req.body
  if (clusterId) {
    const cluster = await CareerCluster.findByPk(clusterId)
    if (!cluster) return res.status(400).json(err('Career cluster not found.'))
  }
  await q.update({ ...fields, ...(clusterId ? { clusterId } : {}) })
  return res.json(ok(await Qualification.findByPk(q.id, { include: [{ model: CareerCluster, as: 'cluster' }] }), 'Updated'))
})

router.delete('/:id', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const q = await Qualification.findByPk(req.params.id)
  if (!q) return res.status(404).json(err('Qualification not found.'))
  q.isActive = false // soft delete - keeps historical job-qualification links intact
  await q.save()
  return res.json(ok(null, 'Deactivated'))
})

export default router

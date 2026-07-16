import { Router } from 'express'
import { CareerCluster } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()

router.get('/', async (req, res) => {
  const clusters = await CareerCluster.findAll({ order: [['name', 'ASC']] })
  return res.json(ok(clusters))
})

router.get('/:id', async (req, res) => {
  const cluster = await CareerCluster.findByPk(req.params.id)
  if (!cluster) return res.status(404).json(err('Cluster not found.'))
  return res.json(ok(cluster))
})

router.post('/', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const cluster = await CareerCluster.create(req.body)
  return res.status(201).json(ok(cluster, 'Cluster created'))
})

router.put('/:id', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const cluster = await CareerCluster.findByPk(req.params.id)
  if (!cluster) return res.status(404).json(err('Cluster not found.'))
  await cluster.update(req.body)
  return res.json(ok(cluster, 'Cluster updated'))
})

router.delete('/:id', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const cluster = await CareerCluster.findByPk(req.params.id)
  if (!cluster) return res.status(404).json(err('Cluster not found.'))
  try {
    await cluster.destroy()
    return res.json(ok(null, 'Cluster deleted'))
  } catch {
    return res.status(409).json(err('This cluster still has jobs inside it - remove or reassign those jobs first.'))
  }
})

export default router

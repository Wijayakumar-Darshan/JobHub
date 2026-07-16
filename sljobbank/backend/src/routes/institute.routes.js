import { Router } from 'express'
import { Institute, Qualification, CareerCluster } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()

// GET /api/institutes?type=&qualificationId=
// qualificationId lets the Job form's "where to get it" dropdown show ONLY
// institutes that actually offer the qualification just selected - the
// "map these nicely" cascading behavior.
router.get('/', async (req, res) => {
  const where = req.query.type ? { type: req.query.type } : {}
  const include = [{
    model: Qualification, as: 'qualificationsOffered',
    include: [{ model: CareerCluster, as: 'cluster' }],
    ...(req.query.qualificationId ? { where: { id: req.query.qualificationId } } : {}),
    through: { attributes: [] },
  }]

  const institutes = await Institute.findAll({ where, include, order: [['name', 'ASC']] })
  return res.json(ok(institutes))
})

router.get('/:id', async (req, res) => {
  const institute = await Institute.findByPk(req.params.id, {
    include: [{ model: Qualification, as: 'qualificationsOffered', through: { attributes: [] } }],
  })
  if (!institute) return res.status(404).json(err('Institute not found.'))
  return res.json(ok(institute))
})

router.post('/', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const { qualificationIds, ...fields } = req.body
  const institute = await Institute.create(fields)
  if (Array.isArray(qualificationIds)) await institute.setQualificationsOffered(qualificationIds)
  const full = await Institute.findByPk(institute.id, { include: [{ model: Qualification, as: 'qualificationsOffered', through: { attributes: [] } }] })
  return res.status(201).json(ok(full, 'Created'))
})

router.put('/:id', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const institute = await Institute.findByPk(req.params.id)
  if (!institute) return res.status(404).json(err('Institute not found.'))
  const { qualificationIds, ...fields } = req.body
  await institute.update(fields)
  if (Array.isArray(qualificationIds)) await institute.setQualificationsOffered(qualificationIds)
  const full = await Institute.findByPk(institute.id, { include: [{ model: Qualification, as: 'qualificationsOffered', through: { attributes: [] } }] })
  return res.json(ok(full, 'Updated'))
})

router.delete('/:id', requireAuth, requireRole('SUPER_ADMIN'), async (req, res) => {
  const institute = await Institute.findByPk(req.params.id)
  if (!institute) return res.status(404).json(err('Institute not found.'))
  await institute.destroy()
  return res.json(ok(null, 'Deleted'))
})

export default router

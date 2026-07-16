import { Router } from 'express'
import { Course, Institute } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'

const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.findAll({ include: [{ model: Institute, as: 'institute' }] })
  return res.json(ok(courses))
})

router.get('/institute/:instituteId', async (req, res) => {
  const courses = await Course.findAll({ where: { instituteId: req.params.instituteId } })
  return res.json(ok(courses))
})

router.get('/job/:jobId', async (req, res) => {
  const courses = await Course.findAll({ where: { jobId: req.params.jobId }, include: [{ model: Institute, as: 'institute' }] })
  return res.json(ok(courses))
})

router.post('/', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const course = await Course.create(req.body)
  return res.status(201).json(ok(course, 'Created'))
})

router.put('/:id', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return res.status(404).json(err('Course not found.'))
  await course.update(req.body)
  return res.json(ok(course, 'Updated'))
})

router.patch('/:id/fee', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return res.status(404).json(err('Course not found.'))
  course.fee = req.body.fee
  await course.save()
  return res.json(ok(course, 'Fee updated'))
})

router.delete('/:id', requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'), async (req, res) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return res.status(404).json(err('Course not found.'))
  await course.destroy()
  return res.json(ok(null, 'Deleted'))
})

export default router

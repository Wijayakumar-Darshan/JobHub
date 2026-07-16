import { Router } from 'express'
import { fn, col, Op } from 'sequelize'
import { User, Job, CareerCluster, StudentView } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { ok } from '../utils/apiResponse.js'
import * as usageAnalyticsService from '../services/usageAnalyticsService.js'
import { generateYearlyReportPdf } from '../services/pdf/usageReport.js'

const router = Router()
router.use(requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'))

router.get('/dashboard', async (req, res) => {
  const totalUsers = await User.count()
  const totalJobs = await Job.count()
  const totalClusters = await CareerCluster.count()
  return res.json(ok({ totalUsers, totalJobs, totalClusters, totalRevenue: 0 }))
})

router.get('/jobs/top', async (req, res) => {
  const counts = await StudentView.findAll({ attributes: ['jobId', [fn('COUNT', col('id')), 'viewCount']], group: ['jobId'] })
  const jobs = await Job.findAll({ where: { id: counts.map((c) => c.jobId) } })
  const jobMap = Object.fromEntries(jobs.map((j) => [j.id, j.title]))
  const top = counts
    .map((c) => ({ jobId: c.jobId, title: jobMap[c.jobId], viewCount: Number(c.get('viewCount')) }))
    .sort((a, b) => b.viewCount - a.viewCount).slice(0, 10)
  return res.json(ok(top))
})

router.get('/monthly-active', async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()
  const month = Number(req.query.month) || new Date().getMonth() + 1
  return res.json(ok(await usageAnalyticsService.monthlyStat(year, month)))
})

router.get('/monthly-breakdown', async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()
  return res.json(ok(await usageAnalyticsService.monthlyBreakdown(year)))
})

router.get('/yearly-report', async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()
  return res.json(ok(await usageAnalyticsService.yearlyReport(year)))
})

router.get('/yearly-report/pdf', async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear()
  const report = await usageAnalyticsService.yearlyReport(year)
  const pdf = await generateYearlyReportPdf(report)
  res.setHeader('Content-Disposition', `attachment; filename="sl-job-bank-yearly-report-${year}.pdf"`)
  res.setHeader('Content-Type', 'application/pdf')
  return res.send(pdf)
})

export default router

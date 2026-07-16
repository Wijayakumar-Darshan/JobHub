import { Router } from 'express'
import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import { User, Job, CareerCluster, Payment } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('COUNSELOR', 'SUPER_ADMIN'))

function pdfHeader(doc, title, subtitle) {
  doc.fillColor('#0A2E1C').fontSize(18).font('Helvetica-Bold').text(title)
  doc.fillColor('#555').fontSize(11).font('Helvetica').text(subtitle)
  doc.moveDown()
}

router.get('/users', async (req, res) => {
  const users = await User.findAll({ order: [['createdAt', 'DESC']] })
  if (req.query.format === 'excel') {
    const wb = new ExcelJS.Workbook()
    const sheet = wb.addWorksheet('Students')
    sheet.columns = [
      { header: 'Name', key: 'fullName', width: 25 }, { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 }, { header: 'Subscription', key: 'subscriptionType', width: 15 },
      { header: 'Active', key: 'isActive', width: 10 }, { header: 'Joined', key: 'createdAt', width: 20 },
    ]
    users.forEach((u) => sheet.addRow(u.toJSON()))
    res.setHeader('Content-Disposition', 'attachment; filename="users_report.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    await wb.xlsx.write(res)
    return res.end()
  }

  const doc = new PDFDocument({ margin: 40 })
  res.setHeader('Content-Disposition', 'attachment; filename="users_report.pdf"')
  res.setHeader('Content-Type', 'application/pdf')
  doc.pipe(res)
  pdfHeader(doc, 'Student Report', `SL Job Bank — ${users.length} registered users`)
  doc.fontSize(9).font('Helvetica')
  users.forEach((u) => doc.text(`${u.fullName}  —  ${u.email}  —  ${u.role}  —  ${u.isActive ? 'Active' : 'Suspended'}`))
  doc.end()
})

router.get('/jobs', async (req, res) => {
  const jobs = await Job.findAll({ include: [{ model: CareerCluster, as: 'cluster' }] })
  const doc = new PDFDocument({ margin: 40 })
  res.setHeader('Content-Disposition', 'attachment; filename="jobs_report.pdf"')
  res.setHeader('Content-Type', 'application/pdf')
  doc.pipe(res)
  pdfHeader(doc, 'Job Analytics Report', `Career listings and demand analysis — ${jobs.length} jobs`)
  doc.fontSize(9).font('Helvetica')
  jobs.forEach((j) => doc.text(`${j.title}  —  ${j.cluster?.name || '-'}  —  Demand: ${j.industryDemand}`))
  doc.end()
})

router.get('/revenue', requireRole('SUPER_ADMIN'), async (req, res) => {
  const payments = await Payment.findAll({ include: [{ model: User, as: 'user' }], order: [['paymentDate', 'DESC']] })
  const totalRevenue = payments.filter((p) => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0)
  const doc = new PDFDocument({ margin: 40 })
  res.setHeader('Content-Disposition', 'attachment; filename="revenue_report.pdf"')
  res.setHeader('Content-Type', 'application/pdf')
  doc.pipe(res)
  pdfHeader(doc, 'Revenue & Payment Report', 'Subscription payments and revenue analysis')
  doc.fontSize(11).font('Helvetica-Bold').text(`Total Revenue: LKR ${totalRevenue.toLocaleString()}`)
  doc.moveDown()
  doc.fontSize(9).font('Helvetica')
  payments.forEach((p) => doc.text(`${p.reference}  —  ${p.user?.fullName || '-'}  —  LKR ${p.amount}  —  ${p.status}`))
  doc.end()
})

export default router

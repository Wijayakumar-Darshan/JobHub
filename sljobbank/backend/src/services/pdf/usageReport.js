import PDFDocument from 'pdfkit'

export function generateYearlyReportPdf(report) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 40, bottom: 40, left: 40, right: 40 } })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fillColor('#0A2E1C').fontSize(18).font('Helvetica-Bold').text(`SL Job Bank — Yearly Statistical Report ${report.year}`)
    doc.fillColor('#555').fontSize(12).font('Helvetica').text('How useful the system was for students this year')
    doc.moveDown()

    const stats = [
      ['Unique Active Students', report.uniqueActiveStudents],
      ['Total Student Logins', report.totalStudentLogins],
      ['New Registrations', report.newStudentRegistrations],
      ['Total Registered Students', report.totalRegisteredStudents],
      ['Avg. Logins per Active Student', report.averageLoginsPerActiveStudent],
      ['Career Key Tests Completed', report.careerTestsCompleted],
    ]
    doc.fontSize(10)
    for (const [label, value] of stats) {
      doc.font('Helvetica-Bold').fillColor('#0A2E1C').text(label, { continued: true, width: 220 })
      doc.font('Helvetica').fillColor('#333').text('   ' + value)
    }

    doc.moveDown()
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0A2E1C').text('Summary')
    doc.moveDown(0.3)
    doc.font('Helvetica').fontSize(10).fillColor('#333').text(report.usefulnessSummary, { lineGap: 3 })

    doc.moveDown()
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0A2E1C').text('Most Searched Jobs')
    doc.moveDown(0.3)
    doc.font('Helvetica').fontSize(9).fillColor('#333')
    for (const j of report.mostSearchedJobs) doc.text(`${j.title}  —  ${j.viewCount} views`)

    doc.moveDown()
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#0A2E1C').text('Least Searched Jobs')
    doc.moveDown(0.3)
    doc.font('Helvetica').fontSize(9).fillColor('#333')
    for (const j of report.leastSearchedJobs) doc.text(`${j.title}  —  ${j.viewCount} views`)

    doc.end()
  })
}

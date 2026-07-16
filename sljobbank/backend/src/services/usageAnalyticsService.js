import { Op, fn, col } from 'sequelize'
import { LoginLog, User, Job, CareerCluster, StudentView, CareerTestAttempt } from '../models/index.js'

export async function monthlyStat(year, month) {
  const from = new Date(year, month - 1, 1)
  const to = new Date(year, month, 0, 23, 59, 59)
  const monthLabel = from.toLocaleString('en-US', { month: 'long' }) + ` ${year}`

  const activeStudents = await LoginLog.count({
    distinct: true, col: 'userId',
    where: { loginAt: { [Op.between]: [from, to] }, role: 'STUDENT' },
  })
  const totalStudentLogins = await LoginLog.count({ where: { loginAt: { [Op.between]: [from, to] }, role: 'STUDENT' } })
  const newStudentRegistrations = await User.count({ where: { role: 'STUDENT', createdAt: { [Op.between]: [from, to] } } })

  return { year, month, monthLabel, activeStudents, totalStudentLogins, newStudentRegistrations }
}

export async function monthlyBreakdown(year) {
  const months = []
  for (let m = 1; m <= 12; m++) months.push(await monthlyStat(year, m))
  return months
}

export async function yearlyReport(year) {
  const from = new Date(year, 0, 1)
  const to = new Date(year, 11, 31, 23, 59, 59)

  const totalStudentLogins = await LoginLog.count({ where: { loginAt: { [Op.between]: [from, to] }, role: 'STUDENT' } })
  const uniqueActiveStudents = await LoginLog.count({ distinct: true, col: 'userId', where: { loginAt: { [Op.between]: [from, to] }, role: 'STUDENT' } })
  const newStudentRegistrations = await User.count({ where: { role: 'STUDENT', createdAt: { [Op.between]: [from, to] } } })
  const totalRegisteredStudents = await User.count({ where: { role: 'STUDENT' } })
  const averageLoginsPerActiveStudent = uniqueActiveStudents === 0 ? 0 : Math.round((totalStudentLogins * 100) / uniqueActiveStudents) / 100

  const monthly = await monthlyBreakdown(year)

  const allJobs = await Job.findAll({ include: [{ model: CareerCluster, as: 'cluster' }] })
  const viewCounts = await StudentView.findAll({
    attributes: ['jobId', [fn('COUNT', col('id')), 'viewCount']],
    group: ['jobId'],
  })
  const viewMap = Object.fromEntries(viewCounts.map((v) => [v.jobId, Number(v.get('viewCount'))]))

  const withCounts = allJobs.map((j) => ({
    jobId: j.id, title: j.title, clusterName: j.cluster?.name, viewCount: viewMap[j.id] || 0,
  }))
  const mostSearchedJobs = [...withCounts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 10)
  const leastSearchedJobs = [...withCounts].sort((a, b) => a.viewCount - b.viewCount).slice(0, 10)

  const clusterTotals = {}
  const clusterNames = {}
  for (const j of allJobs) {
    if (!j.cluster) continue
    clusterTotals[j.cluster.id] = (clusterTotals[j.cluster.id] || 0) + (viewMap[j.id] || 0)
    clusterNames[j.cluster.id] = j.cluster.name
  }
  const clusterPopularity = Object.entries(clusterTotals)
    .map(([id, total]) => ({ clusterId: id, clusterName: clusterNames[id], totalViews: total }))
    .sort((a, b) => b.totalViews - a.totalViews)

  const careerTestsCompleted = await CareerTestAttempt.count({ where: { completedAt: { [Op.between]: [from, to] } } })

  const engagementRate = totalRegisteredStudents === 0 ? 0 : Math.round((uniqueActiveStudents * 1000) / totalRegisteredStudents) / 10
  const topJob = mostSearchedJobs[0]?.title || 'N/A'
  const usefulnessSummary =
    `In ${year}, ${uniqueActiveStudents} students logged in at least once (${engagementRate}% of ${totalRegisteredStudents} registered students), ` +
    `totalling ${totalStudentLogins} logins. ${newStudentRegistrations} new students registered this year. ` +
    `${careerTestsCompleted} Career Key tests were completed. The most explored job was "${topJob}" - use this alongside the ` +
    `least-searched list to spot gaps between what the system offers and what students are actually interested in.`

  return {
    year, totalStudentLogins, uniqueActiveStudents, newStudentRegistrations, totalRegisteredStudents,
    averageLoginsPerActiveStudent, monthlyBreakdown: monthly, mostSearchedJobs, leastSearchedJobs,
    clusterPopularity, careerTestsCompleted, usefulnessSummary,
  }
}

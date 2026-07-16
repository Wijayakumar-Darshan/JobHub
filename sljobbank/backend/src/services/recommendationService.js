import { Job, CareerCluster, Favorite, StudentView, StudentProfile } from '../models/index.js'
import { Op } from 'sequelize'

export async function recommendJobs(userId, limit = 10) {
  const profile = await StudentProfile.findOne({ where: { userId } })
  const allJobs = await Job.findAll({ include: [{ model: CareerCluster, as: 'cluster' }] })

  if (!profile) {
    return allJobs.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit)
  }

  const favorites = await Favorite.findAll({ where: { userId }, include: [{ model: Job, as: 'job', include: [{ model: CareerCluster, as: 'cluster' }] }] })
  const favClusterIds = new Set(favorites.map((f) => f.job?.cluster?.id).filter(Boolean))

  const views = await StudentView.findAll({ where: { userId }, include: [{ model: Job, as: 'job', include: [{ model: CareerCluster, as: 'cluster' }] }] })
  const viewedClusterIds = new Set(views.map((v) => v.job?.cluster?.id).filter(Boolean))

  const scored = allJobs.map((job) => {
    let score = 0
    const clusterId = job.cluster?.id
    if (profile.topClusterId && profile.topClusterId === clusterId) score += 6
    if (profile.alStream && job.alStream && job.alStream.toLowerCase().includes(profile.alStream.toLowerCase())) score += 3
    if (favClusterIds.has(clusterId)) score += 2
    if (viewedClusterIds.has(clusterId)) score += 1
    return { job, score }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.job)
}

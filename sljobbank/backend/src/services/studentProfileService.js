import { CareerCluster, Job, StudentProfile } from '../models/index.js'

/**
 * Scores every cluster against the student's chosen interest tags + A/L stream,
 * picks the highest-scoring one as topCluster. Deliberately simple/explainable -
 * counselors need to see *why* a student matched somewhere, not a black box.
 */
export async function buildInitialProfile(user, { grade, alStream, interestTags }) {
  const clusters = await CareerCluster.findAll()
  const jobs = await Job.findAll()
  const tags = (interestTags || []).map((t) => t.toLowerCase())

  const clusterScores = {}
  for (const cluster of clusters) {
    let score = 0
    const haystack = `${cluster.name || ''} ${cluster.description || ''}`.toLowerCase()
    for (const tag of tags) {
      if (haystack.includes(tag)) score += 2
    }
    if (alStream) {
      const streamMatches = jobs.filter(
        (j) => j.clusterId === cluster.id && j.alStream && j.alStream.toLowerCase().includes(alStream.toLowerCase())
      ).length
      score += streamMatches * 1.5
    }
    clusterScores[cluster.id] = score
  }

  let topCluster = null
  let topScore = -Infinity
  for (const cluster of clusters) {
    const s = clusterScores[cluster.id] ?? 0
    if (s > topScore) { topScore = s; topCluster = cluster }
  }

  let profile = await StudentProfile.findOne({ where: { userId: user.id } })
  const payload = {
    userId: user.id,
    grade: grade || null,
    alStream: alStream || null,
    interestTags: (interestTags || []).join(','),
    topClusterId: topCluster ? topCluster.id : null,
    clusterScoresJson: JSON.stringify(clusterScores),
  }

  if (profile) {
    await profile.update(payload)
  } else {
    profile = await StudentProfile.create(payload)
  }

  console.log(`[studentProfile] built profile for ${user.email} -> topCluster=${topCluster?.name || 'none'}`)
  return getProfileWithCluster(profile.id)
}

export async function getProfileWithCluster(profileId) {
  return StudentProfile.findByPk(profileId, { include: [{ model: CareerCluster, as: 'topCluster' }] })
}

export async function getProfileForUser(userId) {
  return StudentProfile.findOne({ where: { userId }, include: [{ model: CareerCluster, as: 'topCluster' }] })
}

/** Nudges the profile toward a cluster after the student views/favorites a job in it. */
export async function reinforceProfile(userId, clusterId) {
  const profile = await StudentProfile.findOne({ where: { userId } })
  if (!profile || !clusterId) return
  const scores = profile.clusterScoresJson ? JSON.parse(profile.clusterScoresJson) : {}
  scores[clusterId] = (scores[clusterId] || 0) + 1

  let bestId = profile.topClusterId
  let bestScore = -Infinity
  for (const [id, score] of Object.entries(scores)) {
    if (score > bestScore) { bestScore = score; bestId = id }
  }
  await profile.update({ clusterScoresJson: JSON.stringify(scores), topClusterId: bestId })
}

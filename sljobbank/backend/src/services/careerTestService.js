import {
  CareerTest, CareerTestQuestion, CareerTestAttempt, CareerTestAnswer,
  CareerCluster, Job, StudentProfile, User,
} from '../models/index.js'
import { RIASEC_KEYWORDS, RIASEC_DESCRIPTIONS, RIASEC_LETTERS } from './riasecMapping.js'

export async function preTestInfo(testId, user) {
  const test = await CareerTest.findByPk(testId)
  if (!test) { const e = new Error('Test not found.'); e.status = 404; throw e }
  const profile = await StudentProfile.findOne({ where: { userId: user.id } })
  const questionCount = await CareerTestQuestion.count({ where: { testId, isActive: true } })
  const completedBefore = await CareerTestAttempt.count({ where: { testId, userId: user.id, status: 'COMPLETED' } })

  return {
    testId: test.id, testTitle: test.title,
    studentGrade: profile?.grade || 'Not set',
    purpose: test.purpose, whatItIdentifies: test.whatItIdentifies,
    estimatedMinutes: test.estimatedMinutes, questionCount,
    hasCompletedBefore: completedBefore > 0,
  }
}

export async function getQuestions(testId) {
  return CareerTestQuestion.findAll({ where: { testId, isActive: true }, order: [['sortOrder', 'ASC']] })
}

export async function startAttempt(testId, user) {
  const test = await CareerTest.findByPk(testId)
  if (!test) { const e = new Error('Test not found.'); e.status = 404; throw e }
  return CareerTestAttempt.create({ testId, userId: user.id, status: 'IN_PROGRESS', startedAt: new Date() })
}

export async function submitAnswers(attemptId, answers) {
  const attempt = await CareerTestAttempt.findByPk(attemptId)
  if (!attempt) { const e = new Error('Attempt not found.'); e.status = 404; throw e }
  if (attempt.status !== 'IN_PROGRESS') { const e = new Error('This attempt is already completed.'); e.status = 400; throw e }

  for (const item of answers) {
    if (item.value < 1 || item.value > 5) { const e = new Error('Answer value must be 1-5.'); e.status = 400; throw e }
    const existing = await CareerTestAnswer.findOne({ where: { attemptId, questionId: item.questionId } })
    if (existing) await existing.update({ value: item.value })
    else await CareerTestAnswer.create({ attemptId, questionId: item.questionId, value: item.value })
  }
}

export async function completeAttempt(attemptId) {
  const attempt = await CareerTestAttempt.findByPk(attemptId, { include: [{ model: User, as: 'user' }] })
  if (!attempt) { const e = new Error('Attempt not found.'); e.status = 404; throw e }

  const questions = await CareerTestQuestion.findAll({ where: { testId: attempt.testId, isActive: true } })
  const answers = await CareerTestAnswer.findAll({ where: { attemptId } })
  if (answers.length < questions.length) {
    const e = new Error(`Answer all ${questions.length} questions before submitting (answered ${answers.length}).`)
    e.status = 400; throw e
  }

  const byId = Object.fromEntries(questions.map((q) => [q.id, q]))
  const rawScores = { REALISTIC: 0, INVESTIGATIVE: 0, ARTISTIC: 0, SOCIAL: 0, ENTERPRISING: 0, CONVENTIONAL: 0 }
  const maxScores = { ...rawScores }
  for (const a of answers) {
    const cat = byId[a.questionId].category
    rawScores[cat] += a.value
    maxScores[cat] += 5
  }

  const percentScores = {}
  for (const cat of Object.keys(rawScores)) {
    percentScores[cat] = maxScores[cat] === 0 ? 0 : Math.round((rawScores[cat] * 1000) / maxScores[cat]) / 10
  }

  const ranked = Object.keys(percentScores).sort((a, b) => percentScores[b] - percentScores[a])
  const top3 = ranked.slice(0, 3)
  const hollandCode = top3.map((c) => RIASEC_LETTERS[c]).join('')

  const allClusters = await CareerCluster.findAll()
  const recommended = recommendClusters(top3, allClusters)
  const guidanceText = buildGuidanceText(top3, hollandCode, recommended)

  await attempt.update({
    status: 'COMPLETED', completedAt: new Date(),
    scoresJson: JSON.stringify(rawScores), hollandCode,
    topClusterId: recommended[0]?.id || null, guidanceText,
  })

  const suggestedJobs = []
  for (const cluster of recommended) {
    const jobs = await Job.findAll({ where: { clusterId: cluster.id }, limit: 3 })
    suggestedJobs.push(...jobs.map((j) => ({ jobId: j.id, title: j.title, clusterName: cluster.name })))
  }

  return {
    attemptId: attempt.id, studentName: attempt.user.fullName, completedAt: attempt.completedAt,
    scoresPercent: percentScores, hollandCode,
    recommendedClusterNames: recommended.map((c) => c.name),
    guidanceText, suggestedJobs: suggestedJobs.slice(0, 6),
    canDownload: true,
    studentHasDownloaded: !!attempt.studentDownloadedAt,
    counselorDownloadEnabled: attempt.counselorDownloadEnabled,
  }
}

function recommendClusters(top3, allClusters) {
  const seen = new Set()
  const result = []
  for (const cat of top3) {
    for (const keyword of RIASEC_KEYWORDS[cat] || []) {
      for (const cluster of allClusters) {
        if (!seen.has(cluster.id) && cluster.name?.toLowerCase().includes(keyword.toLowerCase())) {
          seen.add(cluster.id)
          result.push(cluster)
        }
      }
    }
  }
  return result.slice(0, 3)
}

function buildGuidanceText(top3, hollandCode, recommended) {
  let text = `Your Holland Code is ${hollandCode}. Your strongest interest areas are: `
  text += top3.map((c) => c.charAt(0) + c.slice(1).toLowerCase()).join(', ') + '.\n\n'
  for (const cat of top3) text += `- ${RIASEC_DESCRIPTIONS[cat]}\n`
  if (recommended.length) {
    text += `\nBased on this, career clusters worth exploring first: ${recommended.map((c) => c.name).join(', ')}.\n`
  }
  text += '\nThis result is a starting point for exploration, not a fixed label - use it as a guide, talk it '
  text += 'through with a counselor, and browse specific jobs in your recommended clusters to see what fits.'
  return text
}

export async function myAttempts(userId) {
  return CareerTestAttempt.findAll({ where: { userId }, include: [{ model: CareerCluster, as: 'topCluster' }], order: [['startedAt', 'DESC']] })
}

export async function getAttempt(attemptId) {
  return CareerTestAttempt.findByPk(attemptId, { include: [{ model: User, as: 'user' }, { model: CareerCluster, as: 'topCluster' }] })
}

export async function allCompletedAttempts() {
  return CareerTestAttempt.findAll({
    where: { status: 'COMPLETED' },
    include: [{ model: User, as: 'user' }, { model: CareerCluster, as: 'topCluster' }],
    order: [['completedAt', 'DESC']],
  })
}

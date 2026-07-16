import { CareerTestAttempt } from '../models/index.js'

/**
 * - ADMIN: always allowed, no restriction, even before the student downloads.
 * - STUDENT: always allowed for their own completed result.
 * - COUNSELOR: allowed ONLY once counselorDownloadEnabled is true, which itself
 *   can only be switched on after the student has downloaded at least once.
 */
export function canDownload(attempt, requester) {
  if (requester.role === 'SUPER_ADMIN') return true
  if (requester.role === 'STUDENT') return attempt.userId === requester.id
  if (requester.role === 'COUNSELOR') return attempt.counselorDownloadEnabled
  return false
}

export async function recordStudentDownload(attemptId, requester) {
  const attempt = await CareerTestAttempt.findByPk(attemptId)
  if (!attempt) { const e = new Error('Result not found.'); e.status = 404; throw e }
  if (attempt.userId !== requester.id && requester.role !== 'SUPER_ADMIN') {
    const e = new Error('Not your result.'); e.status = 403; throw e
  }
  if (!attempt.studentDownloadedAt) {
    attempt.studentDownloadedAt = new Date()
    await attempt.save()
  }
}

export async function enableCounselorDownload(attemptId, counselor) {
  const attempt = await CareerTestAttempt.findByPk(attemptId)
  if (!attempt) { const e = new Error('Result not found.'); e.status = 404; throw e }
  if (!attempt.studentDownloadedAt) {
    const e = new Error('The student hasn\'t downloaded their own result yet. The download button unlocks for counselors only after the student has downloaded it themselves.')
    e.status = 409; throw e
  }
  attempt.counselorDownloadEnabled = true
  attempt.counselorDownloadEnabledBy = counselor.id
  attempt.counselorDownloadEnabledAt = new Date()
  await attempt.save()
}

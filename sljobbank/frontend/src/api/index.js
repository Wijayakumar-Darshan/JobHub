import api from './axiosClient'

// ═══════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════
export const authApi = {
  login:    (data)  => api.post('/auth/login', data),
  register: (data)  => api.post('/auth/register', data),
  refresh:  (token) => api.post('/auth/refresh', { refreshToken: token }),
  logout:   ()      => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
  bootstrapAdmin: (data)  => api.post('/auth/bootstrap-admin', data),
  me: () => api.get('/auth/me'),
}

// ═══════════════════════════════════════════
//  CAREER CLUSTERS
// ═══════════════════════════════════════════
export const clusterApi = {
  getAll:   ()     => api.get('/clusters'),
  getById:  (id)   => api.get(`/clusters/${id}`),
  create:   (data) => api.post('/clusters', data),
  update:   (id, data) => api.put(`/clusters/${id}`, data),
  delete:   (id)   => api.delete(`/clusters/${id}`),
}

// ═══════════════════════════════════════════
//  JOBS
// ═══════════════════════════════════════════
export const jobApi = {
  getAll:    (params) => api.get('/jobs', { params }),
  getById:   (id)     => api.get(`/jobs/${id}`),
  getByCluster: (clusterId) => api.get(`/jobs/cluster/${clusterId}`),
  search:    (q)      => api.get('/jobs/search', { params: { q } }),
  create:    (data)   => api.post('/jobs', data),
  update:    (id, data) => api.put(`/jobs/${id}`, data),
  delete:    (id)     => api.delete(`/jobs/${id}`),
  getRecommended: (limit) => api.get('/jobs/recommended', { params: { limit } }),
  trackView: (id)     => api.post(`/jobs/${id}/view`),
  getQualifications: (jobId) => api.get(`/jobs/${jobId}/qualifications`),
  setQualifications: (jobId, links) => api.put(`/jobs/${jobId}/qualifications`, { links }),
}

// ═══════════════════════════════════════════
//  INSTITUTES
// ═══════════════════════════════════════════
export const instituteApi = {
  getAll:    (type, qualificationId) => api.get('/institutes', { params: { ...(type ? { type } : {}), ...(qualificationId ? { qualificationId } : {}) } }),
  getById:   (id)       => api.get(`/institutes/${id}`),
  create:    (data)     => api.post('/institutes', data),
  update:    (id, data) => api.put(`/institutes/${id}`, data),
  delete:    (id)       => api.delete(`/institutes/${id}`),
}

// ═══════════════════════════════════════════
//  QUALIFICATIONS
// ═══════════════════════════════════════════
export const qualificationApi = {
  getAll:  (clusterId)  => api.get('/qualifications', { params: clusterId ? { clusterId } : {} }),
  create:  (data)       => api.post('/qualifications', data),
  update:  (id, data)   => api.put(`/qualifications/${id}`, data),
  delete:  (id)         => api.delete(`/qualifications/${id}`),
}

// ═══════════════════════════════════════════
//  COURSES
// ═══════════════════════════════════════════
export const courseApi = {
  getAll:        ()     => api.get('/courses'),
  getByInstitute:(id)   => api.get(`/courses/institute/${id}`),
  getByJob:      (id)   => api.get(`/courses/job/${id}`),
  create:        (data) => api.post('/courses', data),
  update:  (id, data)   => api.put(`/courses/${id}`, data),
  delete:        (id)   => api.delete(`/courses/${id}`),
  updateFee: (id, fee)  => api.patch(`/courses/${id}/fee`, { fee }),
}

// ═══════════════════════════════════════════
//  USERS (Admin)
// ═══════════════════════════════════════════
export const userApi = {
  getAll:    (params)   => api.get('/users', { params }),
  getById:   (id)       => api.get(`/users/${id}`),
  create:    (data)     => api.post('/users', data),
  update:    (id, data) => api.put(`/users/${id}`, data),
  delete:    (id)       => api.delete(`/users/${id}`),
  toggleActive: (id)    => api.patch(`/users/${id}/toggle-active`),
  updateRole:   (id, role) => api.patch(`/users/${id}/role`, { role }),
}

// ═══════════════════════════════════════════
//  FAVORITES
// ═══════════════════════════════════════════
export const favoriteApi = {
  getMyFavorites: ()    => api.get('/favorites'),
  add:     (jobId)      => api.post('/favorites', { jobId }),
  remove:  (jobId)      => api.delete(`/favorites/${jobId}`),
}

// ═══════════════════════════════════════════
//  SUBSCRIPTIONS & PAYMENTS
// ═══════════════════════════════════════════
export const subscriptionApi = {
  getMyStatus:  ()     => api.get('/subscriptions/me'),
  initiatePayment: (data) => api.post('/subscriptions/initiate', data),
  verifyPayment: (data)   => api.post('/subscriptions/verify', data),
  getHistory:   ()     => api.get('/subscriptions/history'),
}

export const paymentApi = {
  getAll:    (params)  => api.get('/payments', { params }),
  getById:   (id)      => api.get(`/payments/${id}`),
}

// ═══════════════════════════════════════════
//  SYSTEM SETTINGS (Admin)
// ═══════════════════════════════════════════
export const settingsApi = {
  get:    ()     => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  togglePaidMode: () => api.patch('/settings/toggle-paid-mode'),
  updatePricing:  (data) => api.patch('/settings/pricing', data),
}

// ═══════════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════════
export const analyticsApi = {
  getDashboard:  ()     => api.get('/analytics/dashboard'),
  getMonthly:    ()     => api.get('/analytics/monthly-active'),
  getMonthlyBreakdown: (year) => api.get('/analytics/monthly-breakdown', { params: { year } }),
  getYearlyReport: (year) => api.get('/analytics/yearly-report', { params: { year } }),
  downloadYearlyReportPdf: (year) => api.get('/analytics/yearly-report/pdf', { params: { year }, responseType: 'blob' }),
  getClusterPop: ()     => api.get('/analytics/clusters/popularity'),
  getTopJobs:    ()     => api.get('/analytics/jobs/top'),
  getRevenue:    ()     => api.get('/analytics/revenue'),
  trackJobView:  (jobId) => api.post(`/jobs/${jobId}/view`),
}

// ═══════════════════════════════════════════
//  REPORTS
// ═══════════════════════════════════════════
export const reportApi = {
  generate: (type, format, params) =>
    api.get(`/reports/${type}`, {
      params: { format, ...params },
      responseType: format === 'pdf' || format === 'excel' ? 'blob' : 'json',
    }),
}

// ═══════════════════════════════════════════
//  STUDENT PROFILE (onboarding & personalization)
// ═══════════════════════════════════════════
export const studentProfileApi = {
  onboarding: (data) => api.post('/student-profile/onboarding', data),
  me:         ()     => api.get('/student-profile/me'),
  recommendations: (limit) => api.get('/student-profile/recommendations', { params: { limit } }),
}

// ═══════════════════════════════════════════
//  CAREER TESTS (Career Key psychometric test)
// ═══════════════════════════════════════════
export const careerTestApi = {
  listTests:      ()             => api.get('/career-tests'),
  preTestInfo:    (testId)       => api.get(`/career-tests/${testId}/pre-test-info`),
  getQuestions:   (testId)       => api.get(`/career-tests/${testId}/questions`),
  start:          (testId)       => api.post(`/career-tests/${testId}/start`),
  submitAnswers:  (attemptId, answers) => api.post(`/career-tests/attempts/${attemptId}/answers`, { answers }),
  complete:       (attemptId)    => api.post(`/career-tests/attempts/${attemptId}/complete`),
  myAttempts:     ()             => api.get('/career-tests/my-attempts'),
  studentDownload:(attemptId)    => api.post(`/career-tests/attempts/${attemptId}/download`, {}, { responseType: 'blob' }),
}

// ═══════════════════════════════════════════
//  CAREER TEST RESULTS (counselor / admin view)
// ═══════════════════════════════════════════
export const careerTestResultApi = {
  getAll:  ()           => api.get('/career-test-results'),
  getOne:  (attemptId)  => api.get(`/career-test-results/${attemptId}`),
  enableCounselorDownload: (attemptId) => api.post(`/career-test-results/${attemptId}/enable-counselor-download`),
  download: (attemptId) => api.get(`/career-test-results/${attemptId}/download`, { responseType: 'blob' }),
}

// ═══════════════════════════════════════════
//  CHAT (real-time public chat)
// ═══════════════════════════════════════════
export const chatApi = {
  getRecent: (limit) => api.get('/chat/messages', { params: { limit } }),
  send:      (content) => api.post('/chat/messages', { content }),
  edit:      (id, content) => api.put(`/chat/messages/${id}`, { content }),
  remove:    (id) => api.delete(`/chat/messages/${id}`),
}

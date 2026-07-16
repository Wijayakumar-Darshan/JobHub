import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes from './routes/auth.routes.js'
import studentProfileRoutes from './routes/studentProfile.routes.js'
import userRoutes from './routes/user.routes.js'
import clusterRoutes from './routes/cluster.routes.js'
import jobRoutes from './routes/job.routes.js'
import instituteRoutes from './routes/institute.routes.js'
import qualificationRoutes from './routes/qualification.routes.js'
import courseRoutes from './routes/course.routes.js'
import favoriteRoutes from './routes/favorite.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import subscriptionRoutes from './routes/subscription.routes.js'
import careerTestRoutes from './routes/careerTest.routes.js'
import careerTestResultRoutes from './routes/careerTestResult.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import reportRoutes from './routes/report.routes.js'
import chatRoutes from './routes/chat.routes.js'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/auth', authRoutes)
app.use('/api/student-profile', studentProfileRoutes)
app.use('/api/users', userRoutes)
app.use('/api/clusters', clusterRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/institutes', instituteRoutes)
app.use('/api/qualifications', qualificationRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/career-tests', careerTestRoutes)
app.use('/api/career-test-results', careerTestResultRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/chat', chatRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use((req, res) => res.status(404).json({ success: false, message: 'Not found', data: null }))

// Central error handler - anything thrown in an async route handler lands here
// (express-async-errors forwards it) instead of crashing the process or hanging the request.
app.use((error, req, res, next) => {
  console.error('[unhandled error]', error)
  res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error', data: null })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`SL Job Bank API listening on port ${PORT}`))

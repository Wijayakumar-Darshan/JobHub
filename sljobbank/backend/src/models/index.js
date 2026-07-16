import { sequelize } from '../config/database.js'
import { User } from './User.js'
import { CareerCluster } from './CareerCluster.js'
import { Job } from './Job.js'
import { Institute } from './Institute.js'
import { Course } from './Course.js'
import { Payment } from './Payment.js'
import { Favorite } from './Favorite.js'
import { StudentView } from './StudentView.js'
import { SystemSetting } from './SystemSetting.js'
import { Notification } from './Notification.js'
import { PasswordReset } from './PasswordReset.js'
import { Qualification } from './Qualification.js'
import { JobQualification } from './JobQualification.js'
import { InstituteQualification } from './InstituteQualification.js'
import { StudentProfile } from './StudentProfile.js'
import { AdminAuditLog } from './AdminAuditLog.js'
import { LoginLog } from './LoginLog.js'
import { CareerTest } from './CareerTest.js'
import { CareerTestQuestion } from './CareerTestQuestion.js'
import { CareerTestAttempt } from './CareerTestAttempt.js'
import { CareerTestAnswer } from './CareerTestAnswer.js'

// ── Career Cluster ↔ Job ──────────────────────────────
CareerCluster.hasMany(Job, { foreignKey: 'clusterId', as: 'jobs', onDelete: 'RESTRICT' })
Job.belongsTo(CareerCluster, { foreignKey: 'clusterId', as: 'cluster' })

// ── Institute ↔ Course ────────────────────────────────
Institute.hasMany(Course, { foreignKey: 'instituteId', as: 'courses', onDelete: 'CASCADE' })
Course.belongsTo(Institute, { foreignKey: 'instituteId', as: 'institute' })
Job.hasMany(Course, { foreignKey: 'jobId', as: 'courses', onDelete: 'SET NULL' })
Course.belongsTo(Job, { foreignKey: 'jobId', as: 'job' })

// ── User ↔ Payment / Favorite / StudentView / Notification ──
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments', onDelete: 'CASCADE' })
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' })
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Job.hasMany(Favorite, { foreignKey: 'jobId', as: 'favoritedBy', onDelete: 'CASCADE' })
Favorite.belongsTo(Job, { foreignKey: 'jobId', as: 'job' })

User.hasMany(StudentView, { foreignKey: 'userId', as: 'views', onDelete: 'CASCADE' })
StudentView.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Job.hasMany(StudentView, { foreignKey: 'jobId', as: 'views', onDelete: 'CASCADE' })
StudentView.belongsTo(Job, { foreignKey: 'jobId', as: 'job' })

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' })
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// ── Career Cluster ↔ Qualification (a qualification belongs under a cluster) ──
CareerCluster.hasMany(Qualification, { foreignKey: 'clusterId', as: 'qualifications', onDelete: 'SET NULL' })
Qualification.belongsTo(CareerCluster, { foreignKey: 'clusterId', as: 'cluster' })

// ── Institute ↔ Qualification (many-to-many: which qualifications an institute offers) ──
Institute.belongsToMany(Qualification, { through: InstituteQualification, foreignKey: 'instituteId', otherKey: 'qualificationId', as: 'qualificationsOffered' })
Qualification.belongsToMany(Institute, { through: InstituteQualification, foreignKey: 'qualificationId', otherKey: 'instituteId', as: 'institutesOffering' })

// ── Job ↔ Qualification (via JobQualification) ────────
Job.hasMany(JobQualification, { foreignKey: 'jobId', as: 'jobQualifications', onDelete: 'CASCADE' })
JobQualification.belongsTo(Job, { foreignKey: 'jobId', as: 'job' })
Qualification.hasMany(JobQualification, { foreignKey: 'qualificationId', as: 'jobLinks', onDelete: 'RESTRICT' })
JobQualification.belongsTo(Qualification, { foreignKey: 'qualificationId', as: 'qualification' })
Institute.hasMany(JobQualification, { foreignKey: 'instituteId', as: 'qualificationLinks', onDelete: 'SET NULL' })
JobQualification.belongsTo(Institute, { foreignKey: 'instituteId', as: 'institute' })

// ── User ↔ StudentProfile (1:1) ────────────────────────
User.hasOne(StudentProfile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' })
StudentProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' })
CareerCluster.hasMany(StudentProfile, { foreignKey: 'topClusterId', as: 'matchedProfiles' })
StudentProfile.belongsTo(CareerCluster, { foreignKey: 'topClusterId', as: 'topCluster' })

// ── LoginLog ────────────────────────────────────────
User.hasMany(LoginLog, { foreignKey: 'userId', as: 'loginLogs', onDelete: 'CASCADE' })
LoginLog.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// ── Career Test engine ─────────────────────────────────
CareerTest.hasMany(CareerTestQuestion, { foreignKey: 'testId', as: 'questions', onDelete: 'CASCADE' })
CareerTestQuestion.belongsTo(CareerTest, { foreignKey: 'testId', as: 'test' })

CareerTest.hasMany(CareerTestAttempt, { foreignKey: 'testId', as: 'attempts', onDelete: 'CASCADE' })
CareerTestAttempt.belongsTo(CareerTest, { foreignKey: 'testId', as: 'test' })
User.hasMany(CareerTestAttempt, { foreignKey: 'userId', as: 'careerTestAttempts', onDelete: 'CASCADE' })
CareerTestAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' })
CareerCluster.hasMany(CareerTestAttempt, { foreignKey: 'topClusterId', as: 'careerTestMatches' })
CareerTestAttempt.belongsTo(CareerCluster, { foreignKey: 'topClusterId', as: 'topCluster' })

CareerTestAttempt.hasMany(CareerTestAnswer, { foreignKey: 'attemptId', as: 'answers', onDelete: 'CASCADE' })
CareerTestAnswer.belongsTo(CareerTestAttempt, { foreignKey: 'attemptId', as: 'attempt' })
CareerTestQuestion.hasMany(CareerTestAnswer, { foreignKey: 'questionId', as: 'answers', onDelete: 'CASCADE' })
CareerTestAnswer.belongsTo(CareerTestQuestion, { foreignKey: 'questionId', as: 'question' })

export {
  sequelize, User, CareerCluster, Job, Institute, Course, Payment, Favorite, StudentView,
  SystemSetting, Notification, PasswordReset, Qualification, JobQualification, StudentProfile,
  AdminAuditLog, LoginLog, CareerTest, CareerTestQuestion, CareerTestAttempt, CareerTestAnswer,
  InstituteQualification,
}

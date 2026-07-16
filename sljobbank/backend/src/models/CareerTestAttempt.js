import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const CareerTestAttempt = sequelize.define('CareerTestAttempt', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: { type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED'), defaultValue: 'IN_PROGRESS' },
  startedAt: { type: DataTypes.DATE },
  completedAt: { type: DataTypes.DATE },
  scoresJson: { type: DataTypes.STRING(1000) },
  hollandCode: { type: DataTypes.STRING(10) },
  guidanceText: { type: DataTypes.STRING(4000) },
  studentDownloadedAt: { type: DataTypes.DATE },
  counselorDownloadEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  counselorDownloadEnabledBy: { type: DataTypes.UUID },
  counselorDownloadEnabledAt: { type: DataTypes.DATE },
}, { tableName: 'career_test_attempts' })

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const StudentProfile = sequelize.define('StudentProfile', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  alStream: { type: DataTypes.STRING },
  grade: { type: DataTypes.STRING },
  interestTags: { type: DataTypes.STRING(1000) },
  clusterScoresJson: { type: DataTypes.STRING(2000) },
}, { tableName: 'student_profiles' })

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const StudentView = sequelize.define('StudentView', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  viewedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'student_views' })

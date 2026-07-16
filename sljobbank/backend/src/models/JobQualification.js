import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const JobQualification = sequelize.define('JobQualification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  required: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'job_qualifications' })

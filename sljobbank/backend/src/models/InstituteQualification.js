import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const InstituteQualification = sequelize.define('InstituteQualification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
}, { tableName: 'institute_qualifications' })

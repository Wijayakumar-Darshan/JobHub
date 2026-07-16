import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const CareerTest = sequelize.define('CareerTest', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  purpose: { type: DataTypes.STRING(2000) },
  whatItIdentifies: { type: DataTypes.STRING(2000) },
  estimatedMinutes: { type: DataTypes.STRING(500) },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'career_tests' })

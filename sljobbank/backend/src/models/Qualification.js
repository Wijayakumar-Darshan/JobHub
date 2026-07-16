import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Qualification = sequelize.define('Qualification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  level: {
    type: DataTypes.ENUM('OL', 'AL', 'CERTIFICATE', 'DIPLOMA', 'HND', 'DEGREE', 'POSTGRADUATE', 'PROFESSIONAL'),
    allowNull: false,
  },
  field: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING(2000) },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'qualifications' })
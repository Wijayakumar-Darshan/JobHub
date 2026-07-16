import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Course = sequelize.define('Course', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING },
  fee: { type: DataTypes.DOUBLE },
  deliveryMode: { type: DataTypes.STRING, defaultValue: 'FULL_TIME' },
}, { tableName: 'courses' })

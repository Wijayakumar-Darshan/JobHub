import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Institute = sequelize.define('Institute', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'GOVERNMENT' }, // GOVERNMENT | PRIVATE | PROFESSIONAL | UNIVERSITY
  location: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
}, { tableName: 'institutes' })

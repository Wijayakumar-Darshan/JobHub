import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const CareerTestAnswer = sequelize.define('CareerTestAnswer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  value: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'career_test_answers' })

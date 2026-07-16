import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const CareerTestQuestion = sequelize.define('CareerTestQuestion', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  text: { type: DataTypes.STRING(500), allowNull: false },
  category: {
    type: DataTypes.ENUM('REALISTIC', 'INVESTIGATIVE', 'ARTISTIC', 'SOCIAL', 'ENTERPRISING', 'CONVENTIONAL'),
    allowNull: false,
  },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'career_test_questions' })

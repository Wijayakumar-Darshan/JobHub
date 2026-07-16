import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('STUDENT', 'COUNSELOR', 'SUPER_ADMIN'), allowNull: false, defaultValue: 'STUDENT' },
  subscriptionType: { type: DataTypes.ENUM('FREE', 'PAID'), allowNull: false, defaultValue: 'FREE' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'users' })

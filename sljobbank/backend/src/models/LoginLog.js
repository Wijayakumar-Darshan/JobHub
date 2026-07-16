import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const LoginLog = sequelize.define('LoginLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  role: { type: DataTypes.ENUM('STUDENT', 'COUNSELOR', 'SUPER_ADMIN'), allowNull: false },
  loginAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'login_logs' })

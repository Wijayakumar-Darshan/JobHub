import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const PasswordReset = sequelize.define('PasswordReset', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false },
  tokenHash: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  used: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'password_resets' })

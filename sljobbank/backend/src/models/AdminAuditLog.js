import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const AdminAuditLog = sequelize.define('AdminAuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID },
  action: { type: DataTypes.STRING, allowNull: false },
  ipAddress: { type: DataTypes.STRING },
  userAgent: { type: DataTypes.STRING(500) },
  success: { type: DataTypes.BOOLEAN, defaultValue: false },
  detail: { type: DataTypes.STRING(500) },
}, { tableName: 'admin_audit_logs' })

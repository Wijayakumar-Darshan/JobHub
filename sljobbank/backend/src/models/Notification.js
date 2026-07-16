import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'notifications' })

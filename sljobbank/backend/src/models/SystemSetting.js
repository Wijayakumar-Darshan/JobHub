import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const SystemSetting = sequelize.define('SystemSetting', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  paidModeEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  monthlyPrice: { type: DataTypes.DOUBLE, defaultValue: 500 },
  yearlyPrice: { type: DataTypes.DOUBLE, defaultValue: 5000 },
  bankName: { type: DataTypes.STRING },
  accountNumber: { type: DataTypes.STRING },
  accountHolder: { type: DataTypes.STRING },
}, { tableName: 'system_settings' })

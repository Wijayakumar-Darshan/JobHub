import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const SystemSetting = sequelize.define('SystemSetting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  paidModeEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  monthlyPrice: {
    type: DataTypes.DOUBLE,
    defaultValue: 500,
  },
  yearlyPrice: {
    type: DataTypes.DOUBLE,
    defaultValue: 5000,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  accountHolder: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  qrCodeImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'system_settings',
  timestamps: false,        // we manually handle updatedAt
  // or add createdAt if you want it
});
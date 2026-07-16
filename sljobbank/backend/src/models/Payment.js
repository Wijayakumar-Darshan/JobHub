import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'PENDING' }, // PENDING | COMPLETED | FAILED
  method: { type: DataTypes.STRING },
  reference: { type: DataTypes.STRING },
  paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'payments' })

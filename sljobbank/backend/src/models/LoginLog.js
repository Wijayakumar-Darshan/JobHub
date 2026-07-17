import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const LoginLog = sequelize.define(
  'LoginLog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },

    role: {
      type: DataTypes.ENUM(
        'STUDENT',
        'COUNSELOR',
        'SUPER_ADMIN'
      ),
      allowNull: false
    },

    loginAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'login_at'
    }
  },
  {
    tableName: 'login_logs',
    timestamps: true,
    underscored: true
  }
)
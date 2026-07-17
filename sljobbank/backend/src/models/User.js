import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'full_name'
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM('STUDENT', 'COUNSELOR', 'SUPER_ADMIN'),
      allowNull: false,
      defaultValue: 'STUDENT'
    },

    subscriptionType: {
      type: DataTypes.ENUM('FREE', 'PAID'),
      allowNull: false,
      defaultValue: 'FREE',
      field: 'subscription_type'
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },

    profileImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'profile_image'
    },

    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'phone_number'
    }
  },
  {
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    underscored: true
  }
)
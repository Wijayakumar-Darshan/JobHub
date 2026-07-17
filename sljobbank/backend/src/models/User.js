import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "full_name"
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM(
      "STUDENT",
      "COUNSELOR",
      "SUPER_ADMIN"
    ),
    defaultValue: "STUDENT"
  },

  subscriptionType: {
    type: DataTypes.ENUM(
      "FREE",
      "PAID"
    ),
    defaultValue: "FREE",
    field:"subscription_type"
  },

  isActive:{
    type:DataTypes.BOOLEAN,
    defaultValue:true,
    field:"is_active"
  }

},{
 tableName:"users",
 timestamps:true,
 underscored:true
});
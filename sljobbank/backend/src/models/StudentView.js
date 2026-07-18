import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const StudentView = sequelize.define('StudentView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id',
  },
  userId: {
    type: DataTypes.UUID,          // match the type in your Users table
    allowNull: false,
    field: 'userId',               // because your column is named 'userId'
  },
  jobId: {
    type: DataTypes.UUID,          // match the type in your Jobs table
    allowNull: false,
    field: 'jobId',
  },
  viewedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'viewed_at',            // we use the snake_case column; it exists
  },
}, {
  tableName: 'student_views',
  timestamps: false,               // prevent Sequelize from looking for createdAt/updatedAt
  underscored: false,              // don't auto‑convert attribute names to snake_case
});
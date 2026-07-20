import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const StudentProfile = sequelize.define('StudentProfile', {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false
  },

  alStream: {
    type: DataTypes.STRING,
    field: 'al_stream'
  },

  grade: {
    type: DataTypes.STRING
  },

  interestTags: {
    type: DataTypes.STRING(1000),
    field: 'interest_tags'
  },

  topClusterId: {
    type: DataTypes.UUID,
    field: 'top_cluster_id'
  },

  clusterScoresJson: {
    type: DataTypes.STRING(2000),
    field: 'cluster_scores_json'
  }

}, {
  tableName: 'student_profiles',

  timestamps: true,

  createdAt: 'created_at',

  updatedAt: 'updated_at'
})
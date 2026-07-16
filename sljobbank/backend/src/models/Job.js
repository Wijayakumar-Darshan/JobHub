// models/Job.js (or wherever you define the model)
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { predictDemand } from '../utils/demandPredictor.js';

export const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  responsibilities: { type: DataTypes.TEXT },
  qualifications: { type: DataTypes.TEXT },
  skills: { type: DataTypes.TEXT },
  alStream: { type: DataTypes.STRING },
  alSubjects: { type: DataTypes.STRING },
  salaryMin: { type: DataTypes.DOUBLE },
  salaryMax: { type: DataTypes.DOUBLE },
  industryDemand: {
    type: DataTypes.STRING,
    defaultValue: 'MEDIUM', // will be overridden by hook
  },
  careerPathway: { type: DataTypes.TEXT },
  employmentGrowth: { type: DataTypes.STRING },
  sector: { type: DataTypes.STRING },
  remoteAvailable: { type: DataTypes.BOOLEAN, defaultValue: false },
  internshipAvailable: { type: DataTypes.BOOLEAN, defaultValue: false },
  image: { type: DataTypes.STRING },
  // Optional: allow admin override
  // adminOverride: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'jobs',
  hooks: {
    beforeCreate: (job, options) => {
      const demand = predictDemand(job.toJSON());
      job.industryDemand = demand.label;
    },
    beforeUpdate: (job, options) => {
      // Only re‑predict if the admin hasn't explicitly overridden it
      // if (!job.adminOverride) {
        const demand = predictDemand(job.toJSON());
        job.industryDemand = demand.label;
      // }
    },
  },
});
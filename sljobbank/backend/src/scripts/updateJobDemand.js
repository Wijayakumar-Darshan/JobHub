// Add this at the very top
console.log('🚀 Script started...');

import { sequelize, Job } from '../models/index.js';
import { predictDemand } from '../utils/demandPredictor.js';

async function updateAllDemands() {
  try {
    console.log('📡 Connecting to DB...');
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    console.log('📊 Fetching jobs...');
    const jobs = await Job.findAll();
    console.log(`📊 Found ${jobs.length} jobs.`);

    let updatedCount = 0;
    for (const job of jobs) {
      const demand = predictDemand(job.toJSON());
      if (job.industryDemand !== demand.label) {
        job.industryDemand = demand.label;
        await job.save({ hooks: false });
        updatedCount++;
        console.log(`🔄 Updated "${job.title}" → ${demand.label} (score: ${demand.score})`);
      }
    }

    console.log(`✅ Updated ${updatedCount} jobs.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAllDemands();
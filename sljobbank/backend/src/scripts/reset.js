import { sequelize, CareerCluster, User, Qualification, Institute, CareerTest, CareerTestQuestion } from '../models/index.js';

async function reset() {
  await sequelize.authenticate();

  // Get the exact table names from the models
  const tables = [
    CareerTestQuestion.tableName,
    CareerTest.tableName,
    Qualification.tableName,
    Institute.tableName,
    CareerCluster.tableName,
  ];

  // Truncate in reverse order of dependencies (or use CASCADE)
  for (const table of tables) {
    await sequelize.query(`TRUNCATE TABLE "${table}" CASCADE;`);
    console.log(`✅ Truncated ${table}`);
  }

  console.log('✅ All seed tables truncated.');
  process.exit(0);
}

reset().catch((e) => {
  console.error('❌ Reset failed:', e);
  process.exit(1);
});
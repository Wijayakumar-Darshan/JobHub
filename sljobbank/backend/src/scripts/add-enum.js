import { sequelize } from '../models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query(`ALTER TYPE enum_qualifications_level ADD VALUE 'NVQ';`);
    console.log('✅ Added MASTERS to enum.');
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('✅ MASTERS already in enum.');
    } else {
      console.error('❌ Error:', e);
    }
  }
  process.exit();
})();
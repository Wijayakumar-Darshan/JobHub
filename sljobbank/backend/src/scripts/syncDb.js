import '../models/index.js'
import { sequelize } from '../config/database.js'

async function main() {
  await sequelize.authenticate()
  console.log('Database connection OK.')
  await sequelize.sync({ alter: true })
  console.log('All tables created/updated from models.')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })

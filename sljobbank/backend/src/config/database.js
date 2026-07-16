import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

// Postgres by default (works with Supabase's free Postgres, or any other Postgres
// host) - set DB_DIALECT=mysql in .env if you'd rather host on MySQL instead;
// both dialects are fully supported by Sequelize with no code changes needed
// anywhere else in this project.
const dialect = process.env.DB_DIALECT || 'postgres'

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'sl_job_bank',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || (dialect === 'postgres' ? 5432 : 3306),
    dialect,
    logging: false,
    define: { timestamps: true, underscored: true },
    dialectOptions: process.env.DB_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } } // needed for Supabase/most hosted Postgres
      : {},
  }
)

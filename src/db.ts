import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './modules/processing/schema';

// Falls back to a dummy URL during GitHub Actions CI so tests can boot without secret keys
const connectionString = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
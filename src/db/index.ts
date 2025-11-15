import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schemas';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL n\'est pas défini dans .env');
}

// Connexion PostgreSQL
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Instance Drizzle ORM
export const db = drizzle(client, { schema });

// Types exportés
export type Database = typeof db;
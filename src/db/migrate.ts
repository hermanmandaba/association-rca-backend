import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL manquant');
  }

  console.log('Application des migrations...');

  const connection = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: './drizzle' });
  console.log(' Migrations appliquées avec succès !');
  await connection.end();
  process.exit(0);
};

runMigrations().catch((err) => {
  console.error('Erreur lors des migrations:', err);
  process.exit(1);
});
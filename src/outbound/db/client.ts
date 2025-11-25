import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../../config/env';

const queryClient = postgres(env.databaseUrl, { max: 5 });

export const db = drizzle(queryClient);

import * as dotenv from 'dotenv';
import { serve } from '@hono/node-server';
import app from './server';

// Charger les variables d'environnement
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

// Démarrer le serveur
console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

// Créer l'instance Hono
const app = new Hono();

// Middlewares globaux
app.use('*', logger()); // Logs des requêtes
app.use('*', prettyJSON()); // JSON formaté
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend
  credentials: true,
}));

// Route de santé
app.get('/', (c) => {
  return c.json({
    message: 'API Association RCA',
    version: '1.0.0',
    status: 'running',
  });
});

// Route de health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default app;
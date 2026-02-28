import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import apiRoutes from './routes';
import { rateLimiter } from './middleware/rateLimit';
import { logger } from './utils/logger';
import { config } from './config';

const app = new Hono();

// CORS
app.use('*', cors({
  origin: config.cors.origin,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Accept'],
}));

// Timing header
app.use('*', timing());

// Request logging
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  
  const ip = c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() ||
             c.req.header('X-Real-IP') ||
             'unknown';
  
  logger.request(
    c.req.method,
    c.req.path,
    c.res.status,
    duration,
    ip
  );
});

// Rate limiting
app.use('/api/*', async (c, next) => {
  return rateLimiter.check(c, next);
});

// Routes
app.route('/api/v1', apiRoutes);

// Health check
app.get('/health', (c) => c.json({
  success: true,
  data: {
    status: 'ok',
    timestamp: new Date().toISOString()
  },
  error: null
}));

export default app;

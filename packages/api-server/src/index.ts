import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { createTaskRoutes } from './routes/tasks.js';
import { createApprovalRoutes } from './routes/approvals.js';
import { createHealthRoutes } from './routes/health.js';
import { createEventRoutes } from './routes/events.js';
import { createAuthMiddleware } from './middleware/auth.js';

export interface ApiServerConfig {
  port: number;
  host: string;
  apiKey?: string;
  rateLimitMax: number;
  rateLimitWindow: number;
}

export async function createApiServer(config: ApiServerConfig) {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindow,
  });

  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'AgentX API',
        description: 'AgentX Cognitive Intelligence Platform API',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${config.host}:${config.port}`,
          description: 'Development server',
        },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  if (config.apiKey) {
    fastify.addHook('onRequest', createAuthMiddleware(config.apiKey));
  }

  await fastify.register(createTaskRoutes, { prefix: '/api/v1' });
  await fastify.register(createApprovalRoutes, { prefix: '/api/v1' });
  await fastify.register(createHealthRoutes, { prefix: '/api/v1' });
  await fastify.register(createEventRoutes, { prefix: '/api/v1' });

  return fastify;
}

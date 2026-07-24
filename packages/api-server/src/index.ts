import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { createTaskRoutes } from './routes/tasks.js';
import { createApprovalRoutes } from './routes/approvals.js';
import { createHealthRoutes } from './routes/health.js';
import { createEventRoutes } from './routes/events.js';
import { createMetricsRoutes } from './routes/metrics.js';
import { createGitHubWebhookRoutes } from './integrations/github.js';
import { createAuthMiddleware } from './middleware/auth.js';
import type { PrometheusExporter } from '@agentx/observability';

export { SlackNotifier } from './integrations/slack.js';

export interface ApiServerConfig {
  port: number;
  host: string;
  apiKey: string;
  githubWebhookSecret?: string;
  allowedOrigins: string[];
  rateLimitMax: number;
  rateLimitWindow: number;
  prometheusExporter?: PrometheusExporter;
}

export async function createApiServer(config: ApiServerConfig) {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: config.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: true,
    maxAge: 86400,
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

  fastify.addHook('onRequest', createAuthMiddleware(config.apiKey));

  await fastify.register(createTaskRoutes, { prefix: '/api/v1' });
  await fastify.register(createApprovalRoutes, { prefix: '/api/v1' });
  await fastify.register(createHealthRoutes, { prefix: '/api/v1' });
  await fastify.register(createEventRoutes, { prefix: '/api/v1' });
  await fastify.register(createGitHubWebhookRoutes, {
    secret: config.githubWebhookSecret || '',
  });

  if (config.prometheusExporter) {
    await fastify.register(createMetricsRoutes, { exporter: config.prometheusExporter });
  }

  return fastify;
}

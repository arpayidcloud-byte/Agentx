import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface GitHubWebhookPayload {
  action: string;
  pull_request?: {
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;
  };
  repository?: {
    full_name: string;
  };
}

export async function createGitHubWebhookRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/webhooks/github',
    {
      schema: {
        description: 'GitHub webhook endpoint',
        tags: ['webhooks'],
        body: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            pull_request: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                number: { type: 'number' },
                title: { type: 'string' },
                state: { type: 'string' },
                html_url: { type: 'string' },
              },
            },
            repository: {
              type: 'object',
              properties: {
                full_name: { type: 'string' },
              },
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              received: { type: 'boolean' },
              event: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: GitHubWebhookPayload }>, reply: FastifyReply) => {
      const event = request.headers['x-github-event'] as string;
      const payload = request.body;

      request.log.info({ event, action: payload.action }, 'GitHub webhook received');

      reply.send({
        received: true,
        event,
      });
    },
  );
}

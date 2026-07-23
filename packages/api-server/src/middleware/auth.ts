import type { FastifyRequest, FastifyReply } from 'fastify';

export function createAuthMiddleware(apiKey: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.code(401).send({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7);
    if (token !== apiKey) {
      reply.code(403).send({ error: 'Invalid API key' });
    }
  };
}

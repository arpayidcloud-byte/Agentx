import { timingSafeEqual } from 'crypto';
import type { FastifyRequest, FastifyReply } from 'fastify';

export function createAuthMiddleware(apiKey: string) {
  const apiKeyBuffer = Buffer.from(apiKey, 'utf8');

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.log.warn(
        { path: request.url },
        'Auth failure: Missing or invalid authorization header',
      );
      reply.code(401).send({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7);
    const tokenBuffer = Buffer.from(token, 'utf8');

    if (tokenBuffer.length !== apiKeyBuffer.length) {
      request.log.warn(
        { path: request.url, ip: request.ip },
        'Auth failure: Invalid API key length',
      );
      reply.code(403).send({ error: 'Invalid API key' });
      return;
    }

    const isValid = timingSafeEqual(tokenBuffer, apiKeyBuffer);

    if (!isValid) {
      request.log.warn({ path: request.url, ip: request.ip }, 'Auth failure: Invalid API key');
      reply.code(403).send({ error: 'Invalid API key' });
      return;
    }

    request.log.info({ path: request.url, ip: request.ip }, 'Auth success');
  };
}

import { createMiddleware } from 'hono/factory';
import type { UserRepository } from '../../../domain/users/user.ports';
import { verifyToken } from '../../../config/auth';
import { UnauthorizedError } from '../../../shared/errors';

export const createAuthMiddleware = (users: UserRepository) =>
  createMiddleware(async (c, next) => {
    const header = c.req.header('authorization');
    if (!header) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const token = header.replace('Bearer ', '');
    try {
      const payload = await verifyToken(token);
      const user = await users.findById(payload.sub);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      c.set('user', user);
      await next();
    } catch (error) {
      const message = error instanceof UnauthorizedError ? error.message : 'Unauthorized';
      return c.json({ error: message }, 401);
    }
  });

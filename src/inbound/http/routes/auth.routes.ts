import { Hono } from 'hono';
import { CreateUser, LoginUser } from '../../../domain/users/user.usecases';
import type { UserRepository } from '../../../domain/users/user.ports';
import type { User } from '../../../domain/users/user.entity';
import { isErr } from '../../../shared/result';

export const registerAuthRoutes = (app: Hono<{ Variables: { user: User } }>, users: UserRepository) => {
  const createUser = new CreateUser(users);
  const loginUser = new LoginUser(users);

  app.post('/auth/signup', async (c) => {
    const payload = await c.req.json();
    const result = await createUser.execute(payload);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json({ user: result.value });
  });

  app.post('/auth/login', async (c) => {
    const payload = await c.req.json();
    const result = await loginUser.execute(payload);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 401);
    }
    return c.json(result.value);
  });
};

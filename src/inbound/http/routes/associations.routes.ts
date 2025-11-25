import { Hono } from 'hono';
import type { AssociationRepository } from '../../../domain/associations/association.ports';
import { CreateAssociation, GetAssociation, UpdateAssociation } from '../../../domain/associations/association.usecases';
import { isErr } from '../../../shared/result';
import type { User } from '../../../domain/users/user.entity';

export const registerAssociationRoutes = (
  app: Hono<{ Variables: { user: User } }>,
  associations: AssociationRepository,
) => {
  const createAssociation = new CreateAssociation(associations);
  const getAssociation = new GetAssociation(associations);
  const updateAssociation = new UpdateAssociation(associations);

  app.post('/associations', async (c) => {
    const user = c.get('user');
    const payload = await c.req.json();
    const result = await createAssociation.execute({ ...payload, userId: user.id });
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json(result.value, 201);
  });

  app.get('/associations', async (c) => {
    const user = c.get('user');
    const result = await getAssociation.byUser(user.id);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 404);
    }
    return c.json(result.value);
  });

  app.put('/associations', async (c) => {
    const user = c.get('user');
    const associationResult = await getAssociation.byUser(user.id);
    if (isErr(associationResult)) {
      return c.json({ error: associationResult.error.message }, 404);
    }
    const payload = await c.req.json();
    const result = await updateAssociation.execute({
      id: associationResult.value.id,
      ...payload,
    });
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json(result.value);
  });
};

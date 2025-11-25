import { Hono } from 'hono';
import { AddActivity, ListActivities } from '../../../domain/activities/activity.usecases';
import type { ActivityRepository } from '../../../domain/activities/activity.ports';
import type { AssociationRepository } from '../../../domain/associations/association.ports';
import { isErr } from '../../../shared/result';
import type { User } from '../../../domain/users/user.entity';

export const registerActivityRoutes = (
  app: Hono<{ Variables: { user: User } }>,
  activities: ActivityRepository,
  associations: AssociationRepository,
) => {
  const addActivity = new AddActivity(activities, associations);
  const listActivities = new ListActivities(activities);

  app.post('/activities', async (c) => {
    const user = c.get('user');
    const association = await associations.findByUserId(user.id);
    if (!association) {
      return c.json({ error: 'Association not found' }, 404);
    }
    const payload = await c.req.json();
    const result = await addActivity.execute({ ...payload, associationId: association.id });
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json(result.value, 201);
  });

  app.get('/activities', async (c) => {
    const user = c.get('user');
    const association = await associations.findByUserId(user.id);
    if (!association) {
      return c.json({ error: 'Association not found' }, 404);
    }
    const result = await listActivities.execute(association.id);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json(result.value);
  });
};

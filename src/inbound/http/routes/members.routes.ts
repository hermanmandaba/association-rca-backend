import { Hono } from 'hono';
import { AddMember, DeleteMember, ListMembers, UpdateMember } from '../../../domain/members/member.usecases';
import type { AssociationRepository } from '../../../domain/associations/association.ports';
import type { MemberRepository } from '../../../domain/members/member.ports';
import { isErr } from '../../../shared/result';
import type { User } from '../../../domain/users/user.entity';
import { NotFoundError } from '../../../shared/errors';

export const registerMemberRoutes = (
  app: Hono<{ Variables: { user: User } }>,
  members: MemberRepository,
  associations: AssociationRepository,
) => {
  const addMember = new AddMember(members, associations);
  const listMembers = new ListMembers(members);
  const updateMember = new UpdateMember(members);
  const deleteMember = new DeleteMember(members);

  app.post('/members', async (c) => {
    const user = c.get('user');
    const association = await associations.findByUserId(user.id);
    if (!association) {
      return c.json({ error: 'Association not found' }, 404);
    }
    const payload = await c.req.json();
    const result = await addMember.execute({ ...payload, associationId: association.id });
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json(result.value, 201);
  });

  app.get('/members', async (c) => {
    const user = c.get('user');
    const association = await associations.findByUserId(user.id);
    if (!association) {
      return c.json({ error: 'Association not found' }, 404);
    }
    const result = await listMembers.execute(association.id);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json(result.value);
  });

  app.get('/members/:id', async (c) => {
    const user = c.get('user');
    const association = await associations.findByUserId(user.id);
    if (!association) {
      return c.json({ error: 'Association not found' }, 404);
    }
    const id = c.req.param('id');
    const member = await members.findById(id);
    if (!member || member.associationId !== association.id) {
      return c.json({ error: 'Member not found' }, 404);
    }
    return c.json(member);
  });

  app.put('/members/:id', async (c) => {
    const user = c.get('user');
    const association = await associations.findByUserId(user.id);
    if (!association) {
      return c.json({ error: 'Association not found' }, 404);
    }
    const id = c.req.param('id');
    const payload = await c.req.json();
    const result = await updateMember.execute({ id, associationId: association.id, ...payload });
    if (isErr(result)) {
      const status = result.error instanceof NotFoundError ? 404 : 400;
      return c.json({ error: result.error.message }, status);
    }
    return c.json(result.value);
  });

  app.delete('/members/:id', async (c) => {
    const user = c.get('user');
    const association = await associations.findByUserId(user.id);
    if (!association) {
      return c.json({ error: 'Association not found' }, 404);
    }
    const id = c.req.param('id');
    const result = await deleteMember.execute(id, association.id);
    if (isErr(result)) {
      const status = result.error instanceof NotFoundError ? 404 : 400;
      return c.json({ error: result.error.message }, status);
    }
    return c.json({ success: true });
  });
};

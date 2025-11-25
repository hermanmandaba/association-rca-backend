import { Hono } from 'hono';
import {
  AddContribution,
  ListContributions,
  TotalContributionByMember,
  TotalContributionForAssociation,
} from '../../../domain/contributions/contribution.usecases';
import type { ContributionRepository } from '../../../domain/contributions/contribution.ports';
import type { MemberRepository } from '../../../domain/members/member.ports';
import type { AssociationRepository } from '../../../domain/associations/association.ports';
import { isErr } from '../../../shared/result';
import type { User } from '../../../domain/users/user.entity';

export const registerContributionRoutes = (
  app: Hono<{ Variables: { user: User } }>,
  contributions: ContributionRepository,
  members: MemberRepository,
  associations: AssociationRepository,
) => {
  const addContribution = new AddContribution(contributions, members, associations);
  const listContributions = new ListContributions(contributions, members);
  const totalByMember = new TotalContributionByMember(contributions, members);
  const totalForAssociation = new TotalContributionForAssociation(contributions, associations);

  app.post('/contributions', async (c) => {
    const payload = await c.req.json();
    const result = await addContribution.execute(payload);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 400);
    }
    return c.json(result.value, 201);
  });

  app.get('/contributions/member/:id', async (c) => {
    const memberId = c.req.param('id');
    const result = await listContributions.byMember(memberId);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 404);
    }
    return c.json(result.value);
  });

  app.get('/contributions/member/:id/total', async (c) => {
    const memberId = c.req.param('id');
    const result = await totalByMember.execute(memberId);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 404);
    }
    return c.json({ total: result.value });
  });

  app.get('/contributions/association/:id/total', async (c) => {
    const associationId = c.req.param('id');
    const result = await totalForAssociation.execute(associationId);
    if (isErr(result)) {
      return c.json({ error: result.error.message }, 404);
    }
    return c.json({ total: result.value });
  });
};

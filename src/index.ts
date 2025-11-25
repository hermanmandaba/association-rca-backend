import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { env } from './config/env';
import { registerAuthRoutes } from './inbound/http/routes/auth.routes';
import { registerAssociationRoutes } from './inbound/http/routes/associations.routes';
import { registerMemberRoutes } from './inbound/http/routes/members.routes';
import { registerContributionRoutes } from './inbound/http/routes/contributions.routes';
import { registerActivityRoutes } from './inbound/http/routes/activities.routes';
import { createAuthMiddleware } from './inbound/http/middleware/auth';
import { DrizzleUserRepository } from './outbound/db/repositories/user.repo';
import { DrizzleAssociationRepository } from './outbound/db/repositories/association.repo';
import { DrizzleMemberRepository } from './outbound/db/repositories/member.repo';
import { DrizzleContributionRepository } from './outbound/db/repositories/contribution.repo';
import { DrizzleActivityRepository } from './outbound/db/repositories/activity.repo';
import type { User } from './domain/users/user.entity';

const userRepository = new DrizzleUserRepository();
const associationRepository = new DrizzleAssociationRepository();
const memberRepository = new DrizzleMemberRepository();
const contributionRepository = new DrizzleContributionRepository();
const activityRepository = new DrizzleActivityRepository();

const app = new Hono<{ Variables: { user: User } }>();

registerAuthRoutes(app, userRepository);

const authMiddleware = createAuthMiddleware(userRepository);
app.use('/associations/*', authMiddleware);
app.use('/members/*', authMiddleware);
app.use('/contributions/*', authMiddleware);
app.use('/activities/*', authMiddleware);

registerAssociationRoutes(app, associationRepository);
registerMemberRoutes(app, memberRepository, associationRepository);
registerContributionRoutes(app, contributionRepository, memberRepository, associationRepository);
registerActivityRoutes(app, activityRepository, associationRepository);

serve({
  fetch: app.fetch,
  port: env.port,
});

console.log(`Association RCA API listening on port ${env.port}`);

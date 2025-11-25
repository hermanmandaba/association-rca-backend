import { eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { contributions, members } from '../schema';
import type { Contribution } from '../../../domain/contributions/contribution.entity';
import type { ContributionRepository } from '../../../domain/contributions/contribution.ports';

export class DrizzleContributionRepository implements ContributionRepository {
  async create(contribution: Omit<Contribution, 'id'>): Promise<Contribution> {
    const [created] = await db
      .insert(contributions)
      .values({
        ...contribution,
        amount: contribution.amount.toString(),
      })
      .returning();
    if (!created) {
      throw new Error('Failed to create contribution');
    }
    return mapContribution(created);
  }

  async listByMember(memberId: string): Promise<Contribution[]> {
    const rows = await db.select().from(contributions).where(eq(contributions.memberId, memberId));
    return rows.map(mapContribution);
  }

  async totalByMember(memberId: string): Promise<number> {
    const [row] = await db
      .select({ total: sql`SUM(${contributions.amount})` })
      .from(contributions)
      .where(eq(contributions.memberId, memberId));
    return Number(row?.total ?? 0);
  }

  async totalByAssociation(associationId: string): Promise<number> {
    const [row] = await db
      .select({ total: sql`SUM(${contributions.amount})` })
      .from(contributions)
      .leftJoin(members, eq(contributions.memberId, members.id))
      .where(eq(members.associationId, associationId));
    return Number(row?.total ?? 0);
  }
}

const mapContribution = (row: typeof contributions.$inferSelect): Contribution => ({
  id: row.id,
  memberId: row.memberId,
  amount: Number(row.amount),
  date: row.date,
});

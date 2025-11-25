import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { members } from '../schema';
import type { Member } from '../../../domain/members/member.entity';
import type { MemberRepository } from '../../../domain/members/member.ports';

export class DrizzleMemberRepository implements MemberRepository {
  async create(member: Omit<Member, 'id' | 'status'> & { status?: Member['status'] }): Promise<Member> {
    const [created] = await db.insert(members).values(member).returning();
    if (!created) {
      throw new Error('Failed to create member');
    }
    return mapMember(created);
  }

  async listByAssociation(associationId: string): Promise<Member[]> {
    const rows = await db.select().from(members).where(eq(members.associationId, associationId));
    return rows.map(mapMember);
  }

  async findById(id: string): Promise<Member | null> {
    const [row] = await db.select().from(members).where(eq(members.id, id));
    return row ? mapMember(row) : null;
  }

  async findByEmail(email: string, associationId: string): Promise<Member | null> {
    const [row] = await db
      .select()
      .from(members)
      .where(and(eq(members.email, email), eq(members.associationId, associationId)));
    return row ? mapMember(row) : null;
  }

  async update(id: string, data: Partial<Member>): Promise<Member> {
    const [updated] = await db
      .update(members)
      .set({
        name: data.name,
        phone: data.phone,
        email: data.email,
        status: data.status,
      })
      .where(eq(members.id, id))
      .returning();
    if (!updated) {
      throw new Error('Failed to update member');
    }
    return mapMember(updated);
  }

  async delete(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }
}

const mapMember = (row: typeof members.$inferSelect): Member => ({
  id: row.id,
  associationId: row.associationId,
  name: row.name,
  phone: row.phone ?? null,
  email: row.email,
  status: (row.status as Member['status']) ?? 'active',
});

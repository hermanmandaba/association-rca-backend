import { eq } from 'drizzle-orm';
import { db } from '../client';
import { associations } from '../schema';
import type { Association } from '../../../domain/associations/association.entity';
import type { AssociationRepository } from '../../../domain/associations/association.ports';

export class DrizzleAssociationRepository implements AssociationRepository {
  async create(data: Omit<Association, 'id'>): Promise<Association> {
    const [created] = await db.insert(associations).values(data).returning();
    if (!created) {
      throw new Error('Failed to create association');
    }
    return mapAssociation(created);
  }

  async findById(id: string): Promise<Association | null> {
    const [row] = await db.select().from(associations).where(eq(associations.id, id));
    return row ? mapAssociation(row) : null;
  }

  async findByUserId(userId: string): Promise<Association | null> {
    const [row] = await db.select().from(associations).where(eq(associations.userId, userId));
    return row ? mapAssociation(row) : null;
  }

  async update(id: string, data: Partial<Omit<Association, 'id'>>): Promise<Association> {
    const [updated] = await db
      .update(associations)
      .set({ name: data.name, description: data.description })
      .where(eq(associations.id, id))
      .returning();
    if (!updated) {
      throw new Error('Failed to update association');
    }
    return mapAssociation(updated);
  }
}

const mapAssociation = (row: typeof associations.$inferSelect): Association => ({
  id: row.id,
  userId: row.userId,
  name: row.name,
  description: row.description,
});

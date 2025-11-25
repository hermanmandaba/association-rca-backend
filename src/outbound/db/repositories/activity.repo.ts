import { eq } from 'drizzle-orm';
import { db } from '../client';
import { activities } from '../schema';
import type { Activity } from '../../../domain/activities/activity.entity';
import type { ActivityRepository } from '../../../domain/activities/activity.ports';

export class DrizzleActivityRepository implements ActivityRepository {
  async create(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const [created] = await db.insert(activities).values(activity).returning();
    if (!created) {
      throw new Error('Failed to create activity');
    }
    return mapActivity(created);
  }

  async listByAssociation(associationId: string): Promise<Activity[]> {
    const rows = await db.select().from(activities).where(eq(activities.associationId, associationId));
    return rows.map(mapActivity);
  }
}

const mapActivity = (row: typeof activities.$inferSelect): Activity => ({
  id: row.id,
  associationId: row.associationId,
  title: row.title,
  description: row.description,
  date: row.date,
});

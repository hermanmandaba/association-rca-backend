import type { Activity } from './activity.entity';

export interface ActivityRepository {
  create(activity: Omit<Activity, 'id'>): Promise<Activity>;
  listByAssociation(associationId: string): Promise<Activity[]>;
}

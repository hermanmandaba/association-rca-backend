import { err, ok } from '../../shared/result';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type { AssociationRepository } from '../associations/association.ports';
import { createActivitySchema } from './activity.entity';
import type { Activity } from './activity.entity';
import type { ActivityRepository } from './activity.ports';
import type { Result } from '../../shared/result';

export class AddActivity {
  constructor(
    private activities: ActivityRepository,
    private associations: AssociationRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Activity>> {
    const parsed = createActivitySchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }

    const association = await this.associations.findById(parsed.data.associationId);
    if (!association) {
      return err(new NotFoundError('Association not found'));
    }

    const created = await this.activities.create(parsed.data);
    return ok(created);
  }
}

export class ListActivities {
  constructor(private activities: ActivityRepository) {}

  async execute(associationId: string): Promise<Result<Activity[]>> {
    return ok(await this.activities.listByAssociation(associationId));
  }
}

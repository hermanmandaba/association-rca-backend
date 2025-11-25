import { err, ok } from '../../shared/result';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type { Association } from './association.entity';
import { createAssociationSchema, updateAssociationSchema } from './association.entity';
import type { AssociationRepository } from './association.ports';
import type { Result } from '../../shared/result';

export class CreateAssociation {
  constructor(private associations: AssociationRepository) {}

  async execute(input: unknown): Promise<Result<Association>> {
    const parsed = createAssociationSchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }
    const created = await this.associations.create(parsed.data);
    return ok(created);
  }
}

export class GetAssociation {
  constructor(private associations: AssociationRepository) {}

  async byUser(userId: string): Promise<Result<Association>> {
    const association = await this.associations.findByUserId(userId);
    if (!association) {
      return err(new NotFoundError('Association not found'));
    }
    return ok(association);
  }

  async byId(id: string): Promise<Result<Association>> {
    const association = await this.associations.findById(id);
    if (!association) {
      return err(new NotFoundError('Association not found'));
    }
    return ok(association);
  }
}

export class UpdateAssociation {
  constructor(private associations: AssociationRepository) {}

  async execute(input: unknown): Promise<Result<Association>> {
    const parsed = updateAssociationSchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }

    const existing = await this.associations.findById(parsed.data.id);
    if (!existing) {
      return err(new NotFoundError('Association not found'));
    }

    const updated = await this.associations.update(parsed.data.id, {
      name: parsed.data.name,
      description: parsed.data.description,
    });

    return ok(updated);
  }
}

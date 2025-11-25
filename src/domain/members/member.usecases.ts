import { err, ok } from '../../shared/result';
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors';
import type { AssociationRepository } from '../associations/association.ports';
import { createMemberSchema, updateMemberSchema } from './member.entity';
import type { Member } from './member.entity';
import type { MemberRepository } from './member.ports';
import type { Result } from '../../shared/result';

export class AddMember {
  constructor(
    private members: MemberRepository,
    private associations: AssociationRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Member>> {
    const parsed = createMemberSchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }

    const association = await this.associations.findById(parsed.data.associationId);
    if (!association) {
      return err(new NotFoundError('Association not found'));
    }

    const existing = await this.members.findByEmail(parsed.data.email, parsed.data.associationId);
    if (existing) {
      return err(new ConflictError('Email already used for this association'));
    }

    const created = await this.members.create({
      ...parsed.data,
      status: 'active',
    });

    return ok(created);
  }
}

export class ListMembers {
  constructor(private members: MemberRepository) {}

  async execute(associationId: string): Promise<Result<Member[]>> {
    const list = await this.members.listByAssociation(associationId);
    return ok(list);
  }
}

export class UpdateMember {
  constructor(private members: MemberRepository) {}

  async execute(input: unknown): Promise<Result<Member>> {
    const parsed = updateMemberSchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }

    const existing = await this.members.findById(parsed.data.id);
    if (!existing || existing.associationId !== parsed.data.associationId) {
      return err(new NotFoundError('Member not found for this association'));
    }

    const updated = await this.members.update(parsed.data.id, parsed.data);
    return ok(updated);
  }
}

export class DeleteMember {
  constructor(private members: MemberRepository) {}

  async execute(id: string, associationId: string): Promise<Result<void>> {
    const existing = await this.members.findById(id);
    if (!existing || existing.associationId !== associationId) {
      return err(new NotFoundError('Member not found for this association'));
    }

    await this.members.delete(id);
    return ok(undefined);
  }
}

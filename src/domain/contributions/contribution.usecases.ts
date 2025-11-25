import { err, ok } from '../../shared/result';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type { AssociationRepository } from '../associations/association.ports';
import type { MemberRepository } from '../members/member.ports';
import type { Contribution } from './contribution.entity';
import { createContributionSchema } from './contribution.entity';
import type { ContributionRepository } from './contribution.ports';
import type { Result } from '../../shared/result';

export class AddContribution {
  constructor(
    private contributions: ContributionRepository,
    private members: MemberRepository,
    private associations: AssociationRepository,
  ) {}

  async execute(input: unknown): Promise<Result<Contribution>> {
    const parsed = createContributionSchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }

    const member = await this.members.findById(parsed.data.memberId);
    if (!member) {
      return err(new NotFoundError('Member not found'));
    }

    const association = await this.associations.findById(member.associationId);
    if (!association) {
      return err(new NotFoundError('Association not found for member'));
    }

    const created = await this.contributions.create({
      amount: parsed.data.amount,
      date: parsed.data.date,
      memberId: parsed.data.memberId,
    });

    return ok(created);
  }
}

export class ListContributions {
  constructor(private contributions: ContributionRepository, private members: MemberRepository) {}

  async byMember(memberId: string): Promise<Result<Contribution[]>> {
    const member = await this.members.findById(memberId);
    if (!member) {
      return err(new NotFoundError('Member not found'));
    }
    return ok(await this.contributions.listByMember(memberId));
  }
}

export class TotalContributionByMember {
  constructor(private contributions: ContributionRepository, private members: MemberRepository) {}

  async execute(memberId: string): Promise<Result<number>> {
    const member = await this.members.findById(memberId);
    if (!member) {
      return err(new NotFoundError('Member not found'));
    }
    return ok(await this.contributions.totalByMember(memberId));
  }
}

export class TotalContributionForAssociation {
  constructor(
    private contributions: ContributionRepository,
    private associations: AssociationRepository,
  ) {}

  async execute(associationId: string): Promise<Result<number>> {
    const association = await this.associations.findById(associationId);
    if (!association) {
      return err(new NotFoundError('Association not found'));
    }
    return ok(await this.contributions.totalByAssociation(associationId));
  }
}

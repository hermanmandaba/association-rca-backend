import type { Contribution } from './contribution.entity';

export interface ContributionRepository {
  create(contribution: Omit<Contribution, 'id'>): Promise<Contribution>;
  listByMember(memberId: string): Promise<Contribution[]>;
  totalByMember(memberId: string): Promise<number>;
  totalByAssociation(associationId: string): Promise<number>;
}

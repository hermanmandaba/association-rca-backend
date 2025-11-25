import type { Member } from './member.entity';

export interface MemberRepository {
  create(member: Omit<Member, 'id' | 'status'> & { status?: Member['status'] }): Promise<Member>;
  listByAssociation(associationId: string): Promise<Member[]>;
  findById(id: string): Promise<Member | null>;
  findByEmail(email: string, associationId: string): Promise<Member | null>;
  update(id: string, data: Partial<Member>): Promise<Member>;
  delete(id: string): Promise<void>;
}

import type { Association } from './association.entity';

export interface AssociationRepository {
  create(data: Omit<Association, 'id'>): Promise<Association>;
  findById(id: string): Promise<Association | null>;
  findByUserId(userId: string): Promise<Association | null>;
  update(id: string, data: Partial<Omit<Association, 'id'>>): Promise<Association>;
}

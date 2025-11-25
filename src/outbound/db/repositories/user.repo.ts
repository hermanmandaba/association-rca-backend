import { eq } from 'drizzle-orm';
import { db } from '../client';
import { users } from '../schema';
import type { User } from '../../../domain/users/user.entity';
import type { UserRepository } from '../../../domain/users/user.ports';

export class DrizzleUserRepository implements UserRepository {
  async create(user: Omit<User, 'id'>): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    if (!created) {
      throw new Error('Failed to create user');
    }
    return mapUser(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await db.select().from(users).where(eq(users.email, email));
    return row ? mapUser(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const [row] = await db.select().from(users).where(eq(users.id, id));
    return row ? mapUser(row) : null;
  }
}

const mapUser = (row: typeof users.$inferSelect): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.passwordHash,
  role: row.role as User['role'],
  associationId: row.associationId ?? null,
});

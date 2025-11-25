import bcrypt from 'bcryptjs';
import { createUserSchema, loginSchema } from './user.entity';
import type { User } from './user.entity';
import type { UserRepository } from './user.ports';
import { err, ok } from '../../shared/result';
import type { Result } from '../../shared/result';
import { ConflictError, NotFoundError, ValidationError } from '../../shared/errors';
import { createToken } from '../../config/auth';

export class CreateUser {
  constructor(private users: UserRepository) {}

  async execute(input: unknown): Promise<Result<User>> {
    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }

    const existing = await this.users.findByEmail(parsed.data.email);
    if (existing) {
      return err(new ConflictError('Email already in use'));
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const created = await this.users.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
      associationId: null,
    });

    return ok(created);
  }
}

export class LoginUser {
  constructor(private users: UserRepository) {}

  async execute(input: unknown): Promise<Result<{ token: string; user: User }>> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      return err(new ValidationError(parsed.error.message));
    }

    const user = await mySafeUserFetch(this.users, parsed.data.email);
    if (!user) {
      return err(new NotFoundError('Invalid credentials'));
    }

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) {
      return err(new NotFoundError('Invalid credentials'));
    }

    const token = await createToken({
      sub: user.id,
      role: user.role,
      associationId: user.associationId ?? undefined,
    });

    return ok({ token, user });
  }
}

export class GetCurrentUser {
  constructor(private users: UserRepository) {}

  async execute(userId: string): Promise<Result<User>> {
    const user = await this.users.findById(userId);
    if (!user) {
      return err(new NotFoundError('User not found'));
    }
    return ok(user);
  }
}

const mySafeUserFetch = async (repo: UserRepository, email: string) => {
  try {
    return await repo.findByEmail(email);
  } catch (error) {
    return null;
  }
};

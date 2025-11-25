import { sign, verify } from 'hono/jwt';
import { env } from './env';

export type AuthPayload = {
  sub: string;
  role: 'admin' | 'member';
  associationId?: string;
};

export const createToken = async (payload: AuthPayload) => {
  return sign(payload, env.jwtSecret);
};

export const verifyToken = async (token: string) => {
  return verify(token, env.jwtSecret) as Promise<AuthPayload>;
};

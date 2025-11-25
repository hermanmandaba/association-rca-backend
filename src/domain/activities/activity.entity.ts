import { z } from 'zod';

export const activitySchema = z.object({
  id: z.string(),
  associationId: z.string(),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
});

export type Activity = z.infer<typeof activitySchema>;

export const createActivitySchema = z.object({
  associationId: z.string(),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  date: z.coerce.date(),
});

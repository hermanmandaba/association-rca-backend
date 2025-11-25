import { z } from 'zod';

export const contributionSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  amount: z.number().positive(),
  date: z.coerce.date(),
});

export type Contribution = z.infer<typeof contributionSchema>;

export const createContributionSchema = z.object({
  memberId: z.string(),
  amount: z.number().positive(),
  date: z.coerce.date(),
});

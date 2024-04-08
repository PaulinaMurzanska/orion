import { z } from 'zod';

const GenericErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type GenericError = z.infer<typeof GenericErrorSchema>;

import { z } from 'zod';

const OrderSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

export type Order = z.infer<typeof OrderSchema>;

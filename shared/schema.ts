import { z } from "zod";

export const userSchema = z.object({
  phone: z.string(),
  name: z.string(),
  room: z.string(),
});

export const slotSchema = z.object({
  id: z.string(),
  time: z.string(),
  date: z.string(),
  available: z.boolean(),
  bookedBy: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Slot = z.infer<typeof slotSchema>;

import { z } from "zod";

const placeSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),

  address: z.string().trim().max(255).optional(),

  latitude: z.coerce.number().min(-90).max(90),

  longitude: z.coerce.number().min(-180).max(180),

  notes: z.string().trim().max(1000).optional(),

  estimatedDuration: z.number().int().positive().optional(),

  visitOrder: z.number().int().positive().optional(),
});

export const createPlaceSchema = placeSchema;

export const updatePlaceSchema = placeSchema.partial();

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>;

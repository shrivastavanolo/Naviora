import { z } from "zod";

const tripSchema = z.object({
  title: z.string().trim().min(1).max(100),

  description: z.string().trim().max(500).optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),
});

export const createTripSchema = tripSchema.refine(
  (data) => {
    // allow if either date is missing
    if (!data.startDate || !data.endDate) return true;

    return data.endDate > data.startDate;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"], // attach error to endDate field
  }
);

export const updateTripSchema = tripSchema.partial();

export type CreateTripForm = z.input<typeof createTripSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

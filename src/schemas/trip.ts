import { z } from "zod";

export const createTripSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(100),

    description: z.string().trim().max(500).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  })
  .refine(
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

export type CreateTripInput = z.infer<typeof createTripSchema>;

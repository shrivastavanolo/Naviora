import { z } from "zod";

const optionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.date().optional()
);

const tripSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),

  startDate: optionalDate,
  endDate: optionalDate,
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

export const updateTripSchema = tripSchema.partial().refine(
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

export type CreateTripFormValues = z.input<typeof createTripSchema>;
export type CreateTripInput = z.output<typeof createTripSchema>;

export type UpdateTripFormValues = z.input<typeof updateTripSchema>;
export type UpdateTripInput = z.output<typeof updateTripSchema>;

import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name is too long")
    .optional(),
  bio: z.string().max(200, "Bio is too long").optional(),
  avatar: z.string().url("Invalid image URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

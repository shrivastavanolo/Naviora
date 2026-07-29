import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
});

export function getEnv() {
  return envSchema.parse(process.env);
}

import * as z from "zod";

export const sessionIdPathParamsSchema = z.object({
  id: z.uuid(),
});

export const createUserBodySchema = z.object({
  username: z
    .string()
    .min(1)
    .max(300)
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username"),
});

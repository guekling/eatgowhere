import * as z from "zod";
import { UserRoles, SessionStatus } from "./types";

export const sessionIdPathParamsSchema = z.object({
  id: z.uuid(),
});

export type SessionIdPathParams = z.infer<typeof sessionIdPathParamsSchema>;

export const createUserBodySchema = z.object({
  username: z
    .string()
    .min(1)
    .max(300)
    .trim()
    .regex(/^[a-zA-Z0-9_ ]+$/, "Invalid username"),
  role: z.enum([...Object.values(UserRoles)]),
});

export const createRestaurantBodySchema = z.object({
  name: z.string().min(1).max(300).trim(),
});

export const updateSessionBodySchema = z.object({
  status: z.enum([...Object.values(SessionStatus)]),
  ended_at: z.iso.datetime(),
});

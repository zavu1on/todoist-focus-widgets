import { z } from "zod";

export const accessTokenSchema = z
  .string()
  .trim()
  .min(1, "Access token is empty")
  .min(32, "Access token is too short")
  .regex(/^\S+$/, "Access token must not contain whitespace");

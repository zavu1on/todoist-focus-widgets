import { z } from "zod";
import { accessTokenSchema } from "./accessTokenSchema";

export const loginFormSchema = z.object({
  accessToken: accessTokenSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

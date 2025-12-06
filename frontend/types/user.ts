import { z } from "zod";

export const UserPropsSchema = z.object({
  user: z
    .object({
      name: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
    })
    .optional(),
});

export type UserProps = z.infer<typeof UserPropsSchema>;

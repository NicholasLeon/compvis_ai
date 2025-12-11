import { boolean, z } from "zod";

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

interface HeroScannerProps {
  isLoggedIn: boolean;
}

export const userStatusSchema = z.object({
  isLoggedIn: z.boolean(),
});

export type UserStatus = z.infer<typeof userStatusSchema>;

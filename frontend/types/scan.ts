import { z } from "zod";

export const ScanResponseSchema = z.object({
  plate_number: z.string().nullable(),
  expiry_date: z.string().nullable(),
  success: z.boolean(),
});

export type ScanResponse = z.infer<typeof ScanResponseSchema>;

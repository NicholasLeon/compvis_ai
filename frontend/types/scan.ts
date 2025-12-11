import { z } from "zod";

export const ScanResponseSchema = z.object({
  plate_number: z.string().nullable(),
  expiry_date: z.string().nullable(),
  success: z.boolean(),
});

export type ScanResponse = z.infer<typeof ScanResponseSchema>;

export const ScanStoredDataSchema = z.object({
  plate_number: z.string().min(1),
  expiry_date: z.string().min(1),
  success: z.boolean(),
  imageUrl: z.string().min(1),
});

export type StoredData = z.infer<typeof ScanStoredDataSchema>;

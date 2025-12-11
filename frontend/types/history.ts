import { z } from "zod";
import { VehicleSchema } from "./vehicle";

export const ScanHistoryItemSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  platNomor: z.string(),
  expiryDate: z.string(),
  createdAt: z.string(),

  vehicleId: z.string().nullable(),
  vehicle: VehicleSchema.nullable(),
});

export type ScanHistoryItem = z.infer<typeof ScanHistoryItemSchema>;

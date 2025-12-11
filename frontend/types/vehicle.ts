import z from "zod";

export const VehicleSchema = z.object({
  id: z.string().uuid(),
  platNomor: z.string().min(1),
  pemilik: z.string(),
  jenis: z.string(),
  merk: z.string(),
  model: z.string(),
  warna: z.string(),
  tahun: z.string(),
  pajakBerakhir: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type vehicle = z.infer<typeof VehicleSchema>;

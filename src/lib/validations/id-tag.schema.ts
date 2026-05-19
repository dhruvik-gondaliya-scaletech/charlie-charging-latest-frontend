import * as z from "zod";
import { IdTagStatus } from "@/types";

export const idTagSchema = z.object({
  idTag: z.string().min(1, "ID Tag is required"),
  status: z.nativeEnum(IdTagStatus),
  driverId: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  expiryDate: z.string().optional().or(z.literal("")),
});

export type IdTagFormValues = z.infer<typeof idTagSchema>;

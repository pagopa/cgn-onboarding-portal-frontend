import { z } from "zod";

export const EmptyAddresses = z.array(
  z.object({
    street: z.string().refine(val => val === ""),
    zipCode: z.string().refine(val => val === ""),
    city: z.string().refine(val => val === ""),
    district: z.string().refine(val => val === ""),
    coordinates: z.object({
      latitude: z.string().refine(val => val === ""),
      longitude: z.string().refine(val => val === "")
    })
  })
);

export type EmptyAddresses = z.infer<typeof EmptyAddresses>;

import { z } from "zod/v4";

export const EmptyAddresses = z.array(
  z.object({
    street: z.literal(""),
    zipCode: z.literal(""),
    city: z.literal(""),
    district: z.literal(""),
    coordinates: z.object({
      latitude: z.literal(""),
      longitude: z.literal("")
    })
  })
);

export type EmptyAddresses = z.infer<typeof EmptyAddresses>;

import * as t from "io-ts";

export const EmptyAddresses = t.array(
  t.interface({
    street: t.literal(""),
    zipCode: t.literal(""),
    city: t.literal(""),
    district: t.literal(""),
    coordinates: t.interface({
      latitude: t.literal(""),
      longitude: t.literal("")
    })
  })
);

export type EmptyAddresses = t.TypeOf<typeof EmptyAddresses>;

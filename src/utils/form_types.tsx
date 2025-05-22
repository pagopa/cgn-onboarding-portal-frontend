import * as Yup from "yup";

export const EmptyAddresses = Yup.array(
  Yup.object({
    street: Yup.string().oneOf([""]),
    zipCode: Yup.string().oneOf([""]),
    city: Yup.string().oneOf([""]),
    district: Yup.string().oneOf([""]),
    coordinates: Yup.object({
      latitude: Yup.string().oneOf([""]),
      longitude: Yup.string().oneOf([""])
    })
  })
);

export type EmptyAddresses = Yup.InferType<typeof EmptyAddresses>;
